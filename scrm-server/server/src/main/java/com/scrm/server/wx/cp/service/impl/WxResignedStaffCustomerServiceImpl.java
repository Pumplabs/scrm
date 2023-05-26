package com.scrm.server.wx.cp.service.impl;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.vo.StaffTransferCustomerInfoVO;
import com.scrm.api.wx.cp.vo.StaffTransferCustomerVO;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import com.scrm.server.wx.cp.vo.WxResignedStaffCustomerInfoVO;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.WxResignedStaffCustomer;
import com.scrm.server.wx.cp.mapper.WxResignedStaffCustomerMapper;
import com.scrm.server.wx.cp.service.IWxResignedStaffCustomerService;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalUnassignList;
import me.chanjar.weixin.cp.bean.external.WxCpUserTransferCustomerReq;
import me.chanjar.weixin.cp.bean.external.WxCpUserTransferCustomerResp;
import me.chanjar.weixin.cp.bean.external.WxCpUserTransferResultResp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.api.wx.cp.dto.*;

import com.scrm.server.wx.cp.vo.WxResignedStaffCustomerVO;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.*;

import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.stream.Collectors;

/**
 * 离职员工-客户关联 服务实现类
 *
 * @author xxh
 * @since 2022-06-26
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxResignedStaffCustomerServiceImpl extends ServiceImpl<WxResignedStaffCustomerMapper, WxResignedStaffCustomer> implements IWxResignedStaffCustomerService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxCustomerService wxCustomerService;

    @Autowired
    private IWxCustomerService customerService;


    @Override
    public IPage<WxResignedStaffCustomerVO> pageList(WxResignedStaffCustomerPageDTO dto) {
        LambdaQueryWrapper<WxResignedStaffCustomer> wrapper = new QueryWrapper<WxResignedStaffCustomer>()
                .lambda()
                .eq(WxResignedStaffCustomer::getExtCorpId, dto.getExtCorpId())
                .ne(WxResignedStaffCustomer::getStatus, WxResignedStaffCustomer.STATUS_SUCCESSION_RECORD)
                .orderByDesc(WxResignedStaffCustomer::getAllocateTime)
                .orderByDesc(WxResignedStaffCustomer::getDimissionTime);
        IPage<WxResignedStaffCustomer> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<WxResignedStaffCustomerVO> queryList(WxResignedStaffCustomerQueryDTO dto) {
        LambdaQueryWrapper<WxResignedStaffCustomer> wrapper = new QueryWrapper<WxResignedStaffCustomer>()
                .lambda().eq(WxResignedStaffCustomer::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public WxResignedStaffCustomerVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public WxResignedStaffCustomer save(WxResignedStaffCustomerSaveDTO dto) {

        //封装数据
        WxResignedStaffCustomer wxResignedStaffCustomer = new WxResignedStaffCustomer();
        BeanUtils.copyProperties(dto, wxResignedStaffCustomer);
        wxResignedStaffCustomer.setId(UUID.get32UUID());

        //入库
        save(wxResignedStaffCustomer);

        return wxResignedStaffCustomer;
    }


    /**
     * 翻译
     *
     * @param wxResignedStaffCustomer 实体
     * @return WxResignedStaffCustomerVO 结果集
     * @author xxh
     * @date 2022-06-26
     */
    private WxResignedStaffCustomerVO translation(WxResignedStaffCustomer wxResignedStaffCustomer) {
        WxResignedStaffCustomerVO vo = new WxResignedStaffCustomerVO();
        BeanUtils.copyProperties(wxResignedStaffCustomer, vo);
        return vo;
    }


    @Override
    public WxResignedStaffCustomer checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxResignedStaffCustomer byId = getById(id);
        if (byId == null) {
            throw new BaseException("离职员工-客户关联不存在");
        }
        return byId;
    }

    @Override
    public IPage<WxCustomerVO> waitTransferPage(WxWaitResignedTransferCustomerPageDTO dto) {
        LambdaQueryWrapper<WxResignedStaffCustomer> wrapper = new LambdaQueryWrapper<WxResignedStaffCustomer>()
                .eq(WxResignedStaffCustomer::getExtCorpId, dto.getExtCorpId())
                .eq(WxResignedStaffCustomer::getHandoverStaffExtId, dto.getStaffExtId())
                .eq(WxResignedStaffCustomer::getStatus, WxResignedStaffCustomer.STATUS_SUCCESSION_RECORD)
                .eq(WxResignedStaffCustomer::getDimissionTime, dto.getDimissionTime());
        IPage<WxResignedStaffCustomer> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translationWaitTransferPage);
    }

    private WxCustomerVO translationWaitTransferPage(WxResignedStaffCustomer wxResignedStaffCustomer) {
        String customerExtId = wxResignedStaffCustomer.getCustomerExtId();
        String extCorpId = wxResignedStaffCustomer.getExtCorpId();
        return wxCustomerService.translation(wxCustomerService.checkExists(extCorpId, customerExtId));
    }

    @Override
    public IPage<WxResignedStaffCustomerInfoVO> pageCustomerResignedInheritance(WxResignedStaffCustomerInfoDTO dto) {
        IPage<WxResignedStaffCustomerInfoVO> page = baseMapper.pageCustomerResignedInheritance(new Page<>(dto.getPageNum(), dto.getPageSize()), dto);
        Optional.ofNullable(page.getRecords()).orElse(new ArrayList<>()).forEach(vo -> vo.setHandoverStaff(staffService.translation(staffService.findByExtId(vo.getExtCorpId(), vo.getHandoverStaffExtId()))));
        return page;
    }


    @Override
    public void syncCustomer(String extCorpId) throws WxErrorException {

        List<WxResignedStaffCustomer> saveList = new ArrayList<>();
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        listUnassignedList(externalContactService, null, null).forEach(unassignInfo -> {
            WxResignedStaffCustomer staffCustomer = getOne(new LambdaQueryWrapper<WxResignedStaffCustomer>()
                    .eq(WxResignedStaffCustomer::getExtCorpId, extCorpId)
                    .eq(WxResignedStaffCustomer::getHandoverStaffExtId, unassignInfo.getHandoverUserid())
                    .eq(WxResignedStaffCustomer::getCustomerExtId, unassignInfo.getExternalUserid())
                    .eq(WxResignedStaffCustomer::getDimissionTime, new Date(unassignInfo.getDimissionTime() * 1000))
            );

            if (staffCustomer == null) {
                WxResignedStaffCustomer wxResignedStaffCustomer = new WxResignedStaffCustomer()
                        .setExtCorpId(extCorpId)
                        .setHandoverStaffExtId(unassignInfo.getHandoverUserid())
                        .setCustomerExtId(unassignInfo.getExternalUserid())
                        .setDimissionTime(new Date(unassignInfo.getDimissionTime() * 1000))
                        .setStatus(WxResignedStaffCustomer.STATUS_SUCCESSION_RECORD)
                        .setId(UUID.get32UUID())
                        .setCreator(JwtUtil.getUserId())
                        .setCreateTime(new Date());
                saveList.add(wxResignedStaffCustomer);
            }
        });
        if (ListUtils.isNotEmpty(saveList)) {
            saveBatch(saveList);
        }

        //同步状态
        List<WxResignedStaffCustomer> list = Optional.ofNullable(list(new LambdaQueryWrapper<WxResignedStaffCustomer>()
                .eq(WxResignedStaffCustomer::getExtCorpId, extCorpId)
                .in(WxResignedStaffCustomer::getStatus, Arrays.asList(WxResignedStaffCustomer.STATUS_WAITING_TAKE_OVER, WxResignedStaffCustomer.STATUS_SUCCESSION_RECORD))
                .isNotNull(WxResignedStaffCustomer::getTakeoverStaffExtId)
                .isNotNull(WxResignedStaffCustomer::getHandoverStaffExtId))).orElse(new ArrayList<>());

        Map<String, WxCpUserTransferResultResp.TransferResult> map = new HashMap<>();
        List<String> checkList = new ArrayList<>();
        List<WxResignedStaffCustomer> updateList = new ArrayList<>();
        list.forEach(resignedStaffCustomer -> {
            try {
                String key = resignedStaffCustomer.getHandoverStaffExtId() + resignedStaffCustomer.getTakeoverStaffExtId() + resignedStaffCustomer.getCustomerExtId();
                String checkKey = resignedStaffCustomer.getHandoverStaffExtId() + resignedStaffCustomer.getTakeoverStaffExtId();
                if (!checkList.contains(checkKey)) {
                    List<WxCpUserTransferResultResp.TransferResult> transferResults = resignedTransferResult(externalContactService, resignedStaffCustomer.getHandoverStaffExtId(),
                            resignedStaffCustomer.getTakeoverStaffExtId(), null, null);
                    for (WxCpUserTransferResultResp.TransferResult transferResult : transferResults) {
                        map.put(checkKey + transferResult.getExternalUserid(), transferResult);
                    }
                }
                WxCpUserTransferResultResp.TransferResult transferResult = map.get(key);
                if (transferResult != null) {
                    updateList.add(resignedStaffCustomer.setStatus(transferResult.getStatus().ordinal())
                            .setIsHandOver(!Objects.equals(WxResignedStaffCustomer.STATUS_SUCCESSION_RECORD, transferResult.getStatus().ordinal()))
                            .setTakeoverTime(new Date(transferResult.getTakeOverTime() * 1000)));
                }
            } catch (WxErrorException e) {
                e.printStackTrace();
                throw new BaseException(e.getError().getErrorCode(), e.getError().getErrorMsgEn());
            }
        });

        if (ListUtils.isNotEmpty(updateList)) {
            updateBatchById(updateList);
        }

    }

    public StaffTransferCustomerVO transferCustomer(WxStaffResignedTransferCustomerDTO dto) throws WxErrorException {

        StaffTransferCustomerVO vo = new StaffTransferCustomerVO();
        //校验参数
        Staff handoverStaff = staffService.find(dto.getExtCorpId(), dto.getHandoverStaffExtId());
        if (handoverStaff == null) {
            throw new BaseException("原跟进员工不存在");
        }
        Staff takeoverStaff = staffService.checkExists(dto.getTakeoverStaffExtId(), dto.getExtCorpId());

        List<WxCustomer> wxCustomers = dto.getCustomerExtIds().stream().map(customExtId -> customerService.checkExists(dto.getExtCorpId(), customExtId)).collect(Collectors.toList());

        //递归查询
        if (ListUtils.isEmpty(wxCustomers) || wxCustomers.size() != dto.getCustomerExtIds().size()) {
            throw new BaseException("客户不存在");
        }

        List<WxResignedStaffCustomer> resignedStaffCustomerList = new ArrayList<>();
        //判断这个客户是否在移交中
        wxCustomers.forEach(wxCustomer -> {
            WxResignedStaffCustomer resignedStaffCustomer = getOne(new LambdaQueryWrapper<WxResignedStaffCustomer>()
                    .eq(WxResignedStaffCustomer::getExtCorpId, dto.getExtCorpId())
                    .eq(WxResignedStaffCustomer::getHandoverStaffExtId, dto.getHandoverStaffExtId())
                    .eq(WxResignedStaffCustomer::getCustomerExtId, wxCustomer.getExtId())
                    .eq(WxResignedStaffCustomer::getDimissionTime, dto.getDimissionTime()));
            if (WxResignedStaffCustomer.STATUS_WAITING_TAKE_OVER.equals(resignedStaffCustomer.getStatus())) {
                throw new BaseException(String.format("%s客户正在接替中，不允许操作", wxCustomer.getName()));
            } else if (!WxResignedStaffCustomer.STATUS_SUCCESSION_RECORD.equals(resignedStaffCustomer.getStatus())) {
                throw new BaseException(String.format("%s客户已分配接替", wxCustomer.getName()));
            }
            resignedStaffCustomerList.add(resignedStaffCustomer);
        });

        //转移客户列表
        List<StaffTransferCustomerInfoVO> staffTransferCustomerInfoVOS = new ArrayList<>();

        //调用企业微信接口：分配在职成员的客户
        wxCustomers = Optional.of(wxCustomers).orElse(new ArrayList<>()).stream().filter(customer -> StringUtils.isNotBlank(customer.getExtId())).collect(Collectors.toList());
        Map<String, WxCustomer> customerMap = wxCustomers.stream().collect(Collectors.toMap(WxCustomer::getExtId, o -> o));
        List<List<WxCustomer>> partitionList = ListUtils.partition(wxCustomers, 100);
        partitionList.forEach(customerList -> {
            WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
            WxCpUserTransferCustomerReq customerReq = new WxCpUserTransferCustomerReq();
            customerReq.setTransferMsg(dto.getTransferMsg());
            List<String> customerUserIds = customerList.stream().map(WxCustomer::getExtId).collect(Collectors.toList());
            customerReq.setExternalUserid(customerUserIds);
            customerReq.setHandOverUserid(handoverStaff.getExtId());
            customerReq.setTakeOverUserid(takeoverStaff.getExtId());
            customerReq.setTransferMsg(dto.getTransferMsg());
            WxCpUserTransferCustomerResp resp;
            try {
                resp = externalContactService.transferCustomer(customerReq);
                Optional.ofNullable(resp.getCustomer()).orElse(new ArrayList<>()).forEach(customer -> {
                    WxCustomer wxCustomer = Optional.ofNullable(customerMap.get(customer.getExternalUserid())).orElse(new WxCustomer());
                    StaffTransferCustomerInfoVO staffTransferCustomerInfoVO = new StaffTransferCustomerInfoVO().setCustomerUserId(wxCustomer.getExtId()).setCustomerId(wxCustomer.getId()).setCustomerName(wxCustomer.getName()).setErrCode(customer.getErrcode());
                    staffTransferCustomerInfoVOS.add(staffTransferCustomerInfoVO);
                });
            } catch (WxErrorException e) {
                staffTransferCustomerInfoVOS.addAll(customerList.stream().map(customer -> new StaffTransferCustomerInfoVO().setCustomerName(customer.getName()).setCustomerUserId(customer.getExtId()).setCustomerId(customer.getId()).setErrMsg(e.getError().getErrorMsgEn()).setErrCode(e.getError().getErrorCode())).collect(Collectors.toList()));
                log.error("调用企业微信接口异常，请求参数：【{}】，异常信息：【{}】", customerReq, e.getError().toString(), e);
            }

        });

        List<StaffTransferCustomerInfoVO> succeedList = Optional.of(staffTransferCustomerInfoVOS).orElse(new ArrayList<>()).stream().filter(infoVO -> infoVO.getErrCode() == 0).collect(Collectors.toList());
        vo.setSucceedList(succeedList).setFailList(Optional.of(staffTransferCustomerInfoVOS).orElse(new ArrayList<>()).stream().filter(infoVO -> infoVO.getErrCode() != 0).collect(Collectors.toList())).setSucceedTotal(vo.getSucceedList().size()).setFailTotal(vo.getFailList().size());
        List<String> customerExtIds = succeedList.stream().map(StaffTransferCustomerInfoVO::getCustomerUserId).collect(Collectors.toList());

        List<WxResignedStaffCustomer> updateList = new ArrayList<>();
        if (ListUtils.isNotEmpty(customerExtIds)) {
            resignedStaffCustomerList.forEach(resignedStaffCustomer -> {
                if (customerExtIds.contains(resignedStaffCustomer.getCustomerExtId())) {
                    updateList.add(resignedStaffCustomer.setTakeoverStaffExtId(dto.getHandoverStaffExtId())
                            .setIsHandOver(true)
                            .setStatus(WxResignedStaffCustomer.STATUS_WAITING_TAKE_OVER)
                            .setAllocateTime(new Date()));
                }
            });
        }
        if (ListUtils.isNotEmpty(updateList)) {
            updateBatchById(updateList);
        }

        return vo;


    }


    private List<WxCpUserTransferResultResp.TransferResult> resignedTransferResult(WxCpExternalContactService externalContactService, String handoverStaffExtId, String takeoverStaffExtId, String cursor, List<WxCpUserTransferResultResp.TransferResult> customerList) throws WxErrorException {
        customerList = Optional.ofNullable(customerList).orElse(new ArrayList<>());
        WxCpUserTransferResultResp resultResp = externalContactService.resignedTransferResult(handoverStaffExtId, takeoverStaffExtId, cursor);
        List<WxCpUserTransferResultResp.TransferResult> customer = resultResp.getCustomer();
        if (ListUtils.isNotEmpty(customerList)) {
            customerList.addAll(customer);
        }
        if (StringUtils.isNotBlank(resultResp.getNextCursor())) {
            resignedTransferResult(externalContactService, handoverStaffExtId, takeoverStaffExtId, resultResp.getNextCursor(), customerList);
        }
        return customerList;
    }

    private List<WxCpUserExternalUnassignList.UnassignInfo> listUnassignedList(WxCpExternalContactService externalContactService, String cursor, List<WxCpUserExternalUnassignList.UnassignInfo> unassignedList) throws WxErrorException {
        unassignedList = Optional.ofNullable(unassignedList).orElse(new ArrayList<>());
        WxCpUserExternalUnassignList wxCpUserExternalUnassignList = externalContactService.listUnassignedList(null, cursor, null);
        List<WxCpUserExternalUnassignList.UnassignInfo> unassignInfos = wxCpUserExternalUnassignList.getUnassignInfos();
        if (ListUtils.isNotEmpty(unassignInfos)) {
            unassignedList.addAll(unassignInfos);
        }
        if (!wxCpUserExternalUnassignList.isLast()) {
            listUnassignedList(externalContactService, wxCpUserExternalUnassignList.getNextCursor(), unassignedList);
        }
        return unassignedList;
    }

}
