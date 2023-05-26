package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.ContactWay;
import com.scrm.api.wx.cp.entity.ContactWayStaff;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.common.constant.Constants;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.UUID;
import com.scrm.common.util.*;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.mapper.ContactWayMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxTranslateExportUtils;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.bean.external.WxCpContactWayInfo;
import me.chanjar.weixin.cp.bean.external.WxCpContactWayResult;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 渠道活码 服务实现类
 * @author xxh
 * @since 2021-12-26
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class ContactWayServiceImpl extends ServiceImpl<ContactWayMapper, ContactWay> implements IContactWayService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxTagService tagService;

    @Autowired
    private IWxCustomerService wxCustomerService;

    @Autowired
    private IWxCustomerStaffService customerStaffService;

    @Autowired
    private IWxTempFileService fileService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    private final String LIST_SPIT = ",";

    @Override
    public IPage<ContactWayVO> pageList(ContactWayPageDTO dto){

        LambdaQueryWrapper<ContactWay> wrapper = new QueryWrapper<ContactWay>().lambda()
                .eq(ContactWay::getExtCorpId, dto.getExtCorpId())
                .eq(StringUtils.isNoneBlank(dto.getGroupId()), ContactWay::getGroupId, dto.getGroupId())
                .like(StringUtils.isNotBlank(dto.getName()), ContactWay::getName, dto.getName())
                .ge(dto.getCreatedAtStart() != null, ContactWay::getCreatedAt, dto.getCreatedAtStart())
                .le(dto.getCreatedAtEnd() != null, ContactWay::getCreatedAt, dto.getCreatedAtEnd())
                .and(ListUtils.isNotEmpty(dto.getStaffIds()), wq -> {
                    for (int i = 0; i < dto.getStaffIds().size(); i++) {

                        wq.apply(String.format(
                                " JSON_CONTAINS(staff_ids, '\"%s\"') ", dto.getStaffIds().get(i))
                        );
                        if (i != dto.getStaffIds().size() - 1) {
                            wq.or();
                        }
                    }
                })
                .orderByDesc(ContactWay::getCreatedAt);

        IPage<ContactWay> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()),wrapper);
        IPage<ContactWayVO> result = page.convert(this::translation);
        BeanUtil.initNUll(result);
        return result;
    }



    @Override
    public ContactWayVO findById(String id){
        return translation(checkExists(id));
    }


    @Override
    public ContactWay save(ContactWaySaveDTO dto){

        //封装数据
        ContactWay contactWay = new ContactWay();
        BeanUtils.copyProperties(dto,contactWay);
        contactWay.setId(UUID.get16UUID());
        contactWay.setExtCreatorId(JwtUtil.getUserId());
        //state长度最长30
        contactWay.setState(Constants.CONTACT_WAY_STATE_PRE + contactWay.getId());
        contactWay.setReplyInfo(dto.getAutoReply());
        contactWay.setCreatedAt(new Date());
        contactWay.setUpdatedAt(new Date());

        //查询员工信息
        List<Staff> staffs = staffService.listByIds(dto.getStaffIds());

        //封装新增渠道活码的参数
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        WxCpContactWayInfo wxCpContactWayInfo = translation(contactWay, staffs);

        WxCpContactWayResult wxCpContactWayResult;
        try {
            wxCpContactWayResult = contactService.addContactWay(wxCpContactWayInfo);
        } catch (WxErrorException e) {
            log.error("调用微信api新增渠道活码失败，[{}], e", JSONObject.toJSONString(wxCpContactWayInfo), e);
            throw BaseException.buildBaseException(e.getError(), "新增渠道活码失败");
        }

        contactWay.setConfigId(wxCpContactWayResult.getConfigId());
        contactWay.setQrCode(wxCpContactWayResult.getQrCode());

        //入库
        save(contactWay);

        return contactWay;
    }

    /**
     * 把员工信息转换成渠道活码的员工信息
     * @param extCorpId
     * @param dailyAddCustomerLimit
     * @param contactWayId
     * @param staffs
     * @param isBackOut
     * @return
     */
    private List<ContactWayStaff> translationStaff(String extCorpId, Integer dailyAddCustomerLimit, String contactWayId, List<Staff> staffs, boolean isBackOut) {

        return staffs.stream().map(staff -> {

            ContactWayStaff res = new ContactWayStaff();
            res.setId(UUID.get32UUID()).setExtCorpId(extCorpId).setExtCreatorId(JwtUtil.getUserId())
                    .setContactWayId(contactWayId).setDailyAddCustomerLimit(dailyAddCustomerLimit)
                    .setStaffId(staff.getId()).setExtStaffId(staff.getExtId()).setName(staff.getName())
                    .setAvatarUrl(staff.getAvatarUrl()).setIsBackOut(isBackOut)
                    .setCreatedAt(new Date()).setUpdatedAt(new Date());
            return res;

        }).collect(Collectors.toList());
    }

    private WxCpContactWayInfo translation(ContactWay myContactWay, List<Staff> staffs) {

        List<String> staffIds = staffs.stream().map(Staff::getExtId).collect(Collectors.toList());

        WxCpContactWayInfo result = new WxCpContactWayInfo();
        WxCpContactWayInfo.ContactWay contactWay = new WxCpContactWayInfo.ContactWay();
        result.setContactWay(contactWay);

        contactWay.setType(WxCpContactWayInfo.TYPE.MULTI);
        contactWay.setScene(WxCpContactWayInfo.SCENE.QRCODE);
        contactWay.setUsers(staffIds);
        contactWay.setState(myContactWay.getState());
        contactWay.setRemark(myContactWay.getRemark());
        contactWay.setSkipVerify(myContactWay.getSkipVerify());
        //更新才有
        contactWay.setConfigId(myContactWay.getConfigId());

        return result;
    }


    @Override
    public ContactWay update(ContactWayUpdateDTO dto){

        //校验参数
        ContactWay old = checkExists(dto.getId());

        BeanUtils.copyProperties(dto, old);
        old.setReplyInfo(dto.getAutoReply());
        old.setUpdatedAt(new Date());

        updateById(old);

        updateRealityStaff(dto.getId());

        return old;
    }


    @Override
    public void delete(String id){

        //校验参数
        ContactWay contactWay = checkExists(id);

        removeById(id);
    }


    @Override
    public void batchDelete(BatchDTO<String> dto){

        //校验参数
        List<ContactWay> contactWayList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> contactWayList.add(checkExists(id)));

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     * @param contactWay 实体
     * @return ContactWayVO 结果集
     * @author xxh
     * @date 2021-12-26
     */
    private ContactWayVO translation(ContactWay contactWay){
        ContactWayVO vo = new ContactWayVO();
        BeanUtils.copyProperties(contactWay, vo);
        //客户标签
        if (ListUtils.isNotEmpty(contactWay.getCustomerTagExtIds())) {
            vo.setCustomerTags(tagService.listByIds(contactWay.getCustomerTagExtIds()));
        }

        vo.setStaffs(staffService.listByIds(contactWay.getStaffIds()));
        if (ListUtils.isNotEmpty(vo.getBackOutStaffIds())) {
            vo.setBackOutStaffs(staffService.listByIds(contactWay.getBackOutStaffIds()));
        }
        //创建者
        vo.setCreatorInfo(staffService.find(vo.getExtCorpId(), vo.getExtCreatorId()));
        return vo;
    }


    @Override
    public ContactWay checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        ContactWay byId = getById(id);
        if (byId == null) {
            throw new BaseException("渠道活码不存在");
        }
        return byId;
    }

    @Override
    public WxCpContactWayResult getCommonContact(String extCorpId, String configId, String state,
                                                 List<String> extStaffIds, Boolean skipVerify) {

        //state长度最长30
        if (state == null || ListUtils.isEmpty(extStaffIds) || skipVerify == null) {
            throw new BaseException("缺少必要参数");
        }

        if (state.length() > 30) {
            throw new BaseException("state长度过长！");
        }

        //构造参数
        WxCpContactWayInfo wxCpContactWayInfo = new WxCpContactWayInfo();
        WxCpContactWayInfo.ContactWay contactWay = new WxCpContactWayInfo.ContactWay();
        wxCpContactWayInfo.setContactWay(contactWay);

        contactWay.setType(WxCpContactWayInfo.TYPE.MULTI);
        contactWay.setScene(WxCpContactWayInfo.SCENE.QRCODE);
        contactWay.setUsers(extStaffIds);
        contactWay.setState(state);
        contactWay.setSkipVerify(skipVerify);
        //更新才有
        contactWay.setConfigId(configId);

        //封装新增渠道活码的参数
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        try {
            return contactService.addContactWay(wxCpContactWayInfo);
        } catch (WxErrorException e) {
            log.error("调用微信api新增渠道活码失败，[{}], e", JSONObject.toJSONString(wxCpContactWayInfo), e);
            throw BaseException.buildBaseException(e.getError(), "新增渠道活码失败");
        }
    }

    @Override
    public void deleteByConfigIds(String extCorpId, List<String> configIdList) {

        //封装新增渠道活码的参数
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        try {
            for (String id : configIdList) {
                contactService.deleteContactWay(id);
            }
        } catch (WxErrorException e) {
            log.error("调用微信api删除渠道活码失败，[{}], e", JSONObject.toJSONString(configIdList), e);
            throw BaseException.buildBaseException(e.getError(), "删除渠道活码失败");
        }

    }

    @Override
    public ContactWayCountTotalResVO countTotal(ContactWayCountParamsVO paramsVO) {

        List<WxCustomerStaff> customerStaffList = customerStaffService.listByCondition(paramsVO);

        if (ListUtils.isEmpty(customerStaffList)) {
            return new ContactWayCountTotalResVO();
        }

        //总的
        ContactWayCountResVO total = new ContactWayCountResVO();
        //今天的
        ContactWayCountResVO today = new ContactWayCountResVO();

        Date todayDate = DateUtils.getTodayDate();

        for (WxCustomerStaff customerStaff : customerStaffList) {
            total.count(customerStaff);
            if (todayDate.before(customerStaff.getCreateTime())) {
                today.count(customerStaff);
            }
        }

        ContactWayCountTotalResVO result = new ContactWayCountTotalResVO();
        result.setTotal(total);
        result.setToday(today);
        return result;
    }

    @Override
    public List<ContactWayCountResVO> countByDate(ContactWayCountParamsVO paramsVO) {
        List<WxCustomerStaff> customerStaffList = customerStaffService.listByCondition(paramsVO);

        if (ListUtils.isEmpty(customerStaffList)) {
            return new ArrayList<>();
        }

        //根据创建日期分组
        Map<String, List<WxCustomerStaff>> customerStaffMap = new HashMap<>();

        for (WxCustomerStaff customerStaff : customerStaffList) {

            String simpleStr = DateUtils.dateToSimpleStr(customerStaff.getCreateTime());
            List<WxCustomerStaff> dateList = customerStaffMap.computeIfAbsent(simpleStr, k -> new ArrayList<>());
            dateList.add(customerStaff);

        }

        List<ContactWayCountResVO> result = new ArrayList<>(customerStaffMap.size());
        //计算结果
        customerStaffMap.forEach((date, val) -> {

            ContactWayCountResVO resVO = new ContactWayCountResVO();
            resVO.setDateStr(date);
            val.forEach(resVO::count);
            result.add(resVO);
        });

        //排序
        result.sort(Comparator.comparing(ContactWayCountResVO::getDateStr));
        return result;
    }

    @Override
    public List<ContactWayCountResVO> countByStaff(ContactWayCountParamsVO paramsVO) {
        List<WxCustomerStaff> customerStaffList = customerStaffService.listByCondition(paramsVO);

        if (ListUtils.isEmpty(customerStaffList)) {
            return new ArrayList<>();
        }

        //根据员工分组
        Map<String, List<WxCustomerStaff>> customerStaffMap = new HashMap<>();

        for (WxCustomerStaff customerStaff : customerStaffList) {

            List<WxCustomerStaff> dateList = customerStaffMap.computeIfAbsent(customerStaff.getExtStaffId(), k -> new ArrayList<>());
            dateList.add(customerStaff);

        }

        List<ContactWayCountResVO> result = new ArrayList<>(customerStaffMap.size());
        //计算结果
        customerStaffMap.forEach((extStaffId, val) -> {

            ContactWayCountResVO resVO = new ContactWayCountResVO();
            resVO.setStaff(staffService.find(paramsVO.getExtCorpId(), extStaffId));
            val.forEach(resVO::count);
            result.add(resVO);
        });

        return result;
    }

    @Override
    public List<ContactWayCountDetailVO> countByCustomer(ContactWayCountParamsVO paramsVO) {
        List<WxCustomerStaff> customerStaffList = customerStaffService.listByCondition(paramsVO);

        if (ListUtils.isEmpty(customerStaffList)) {
            return new ArrayList<>();
        }

        return customerStaffList.stream().map(e -> {

            ContactWayCountDetailVO detailVO = new ContactWayCountDetailVO();
            detailVO.setHasDelete(e.getHasDelete() == null ||
                    (e.getIsDeletedStaff() != null && e.getIsDeletedStaff()))
                    .setCreateTime(e.getCreateTime())
                    .setStaff(staffService.find(paramsVO.getExtCorpId(), e.getExtStaffId()))
                    .setCustomer(wxCustomerService.find(paramsVO.getExtCorpId(), e.getExtCustomerId()));
            return detailVO;
        }).sorted((o1, o2) -> o2.getCreateTime().compareTo(o1.getCreateTime()))
                .collect(Collectors.toList());

    }

    @Override
    public void exportUrlByDate(ContactWayCountParamsVO paramsVO, HttpServletRequest request, HttpServletResponse response) {
        List<ContactWayCountResVO> data = countByDate(paramsVO);

        List<ContactWayCountDateExportDTO> dataList = data.stream().map(e -> {
            ContactWayCountDateExportDTO dto = new ContactWayCountDateExportDTO();
            BeanUtils.copyProperties(e, dto);
            return dto;
        }).collect(Collectors.toList());

        EasyPoiUtils.export("日期明细"+ DateUtils.getExportDateStr(), null, null, ContactWayCountDateExportDTO.class, dataList, response, request);

    }

    @Override
    public void getExportUrlByStaff(ContactWayCountParamsVO paramsVO) {
        List<ContactWayCountResVO> data = countByStaff(paramsVO);

        List<ContactWayCountStaffExportDTO> dataList = data.stream().map(e -> {
            ContactWayCountStaffExportDTO dto = new ContactWayCountStaffExportDTO();
            BeanUtils.copyProperties(e, dto);
            return dto;
        }).collect(Collectors.toList());

        EasyPoiUtils.export("员工明细"+ DateUtils.getExportDateStr(), null, null, ContactWayCountStaffExportDTO.class, dataList);
    }

    @Override
    public void getExportUrlByCustomer(ContactWayCountParamsVO paramsVO) {
        List<ContactWayCountDetailVO> data = countByCustomer(paramsVO);

        List<ContactWayCountCustomerExportDTO> dataList = data.stream().map(e -> {
            ContactWayCountCustomerExportDTO dto = new ContactWayCountCustomerExportDTO();
            dto.setCustomerName(e.getCustomer().getName())
                    .setStatus(e.getHasDelete() ? "已流失": "未流失")
                    .setCreateTime(DateUtils.dateToFullStr(e.getCreateTime()));
            return dto;
        }).collect(Collectors.toList());

        EasyPoiUtils.export("客户明细"+ DateUtils.getExportDateStr(), null, null, ContactWayCountCustomerExportDTO.class, dataList);
    }

    @Override
    public void updateRealityStaff(String id) {

        ContactWay contactWay = checkExists(id);

        List<Staff> realityStaffs;

        if (contactWay.getDailyAddCustomerLimitEnable()) {
            realityStaffs = getRealityStaffFilter(contactWay);
        }else{
            realityStaffs = staffService.listByIds(contactWay.getStaffIds());
        }

        //封装新增渠道活码的参数
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        WxCpContactWayInfo wxCpContactWayInfo = translation(contactWay, realityStaffs);

        WxCpBaseResp wxCpBaseResp;
        try {
            wxCpBaseResp = contactService.updateContactWay(wxCpContactWayInfo);
        } catch (WxErrorException e) {
            log.error("调用微信api新增渠道活码失败，[{}], e", JSONObject.toJSONString(wxCpContactWayInfo), e);
            throw BaseException.buildBaseException(e.getError(), "更新渠道活码失败");
        }


    }

    /**
     * 开启了每日添加客户上限的，判断客户有没有上限
     * @param contactWay
     * @return
     */
    private List<Staff> getRealityStaffFilter(ContactWay contactWay) {

        List<Staff> staffList = staffService.listByIds(contactWay.getStaffIds());

        List<Staff> result = staffList.stream().filter(staff ->
                customerStaffService.countByDate(contactWay.getExtCorpId(), staff.getExtId(), contactWay.getState(),  new Date()) < contactWay.getDailyAddCustomerLimit())
                .collect(Collectors.toList());

        if (ListUtils.isEmpty(result)) {
            result = staffService.listByIds(contactWay.getBackOutStaffIds());
        }
        return result;
    }

}
