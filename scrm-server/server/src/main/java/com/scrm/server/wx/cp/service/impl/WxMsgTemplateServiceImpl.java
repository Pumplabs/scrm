package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.*;
import com.scrm.api.wx.cp.enums.WxMsgSendStatusEnum;
import com.scrm.api.wx.cp.vo.MsgTemplateExportVO;
import com.scrm.api.wx.cp.vo.WxMsgTemplateVO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.exception.WxErrorEnum;
import com.scrm.common.util.UUID;
import com.scrm.common.util.*;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.mapper.WxMsgTemplateMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.WxCpMsgTemplate;
import me.chanjar.weixin.cp.bean.external.WxCpMsgTemplateAddResult;
import me.chanjar.weixin.cp.bean.external.contact.WxCpGroupMsgListResult;
import me.chanjar.weixin.cp.bean.external.contact.WxCpGroupMsgSendResult;
import me.chanjar.weixin.cp.bean.external.contact.WxCpGroupMsgTaskResult;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 客户群发 服务实现类
 * @author xxh
 * @since 2022-02-12
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxMsgTemplateServiceImpl extends ServiceImpl<WxMsgTemplateMapper, WxMsgTemplate> implements IWxMsgTemplateService {

    @Autowired
    private IWxCustomerService wxCustomerService;

    @Autowired
    private IWxMsgTemplateDetailService detailService;

    @Autowired
    private IWxCustomerStaffService wxCustomerStaffService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IStaffDepartmentService staffDepartmentService;

    @Autowired
    private IDepartmentService departmentService;

    @Autowired
    private IWxTagService tagService;

    @Autowired
    private IWxGroupChatService chatService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;
    
    @Autowired
    private ISysRoleStaffService sysRoleStaffService;

    private final String REMAIN_TIPS = "【任务提醒】有新的任务啦！\n" +
            "\n" +
            "任务类型：群发任务\n" +
            "\n" +
            "创建时间：%s\n" +
            "\n" +
            "可前往【客户联系】中确认发送，记得及时完成哦";

    @Override
    public IPage<WxMsgTemplateVO> pageList(WxMsgTemplatePageDTO dto){

        LambdaQueryWrapper<WxMsgTemplate> queryWrapper = buildQuery(dto);

        IPage<WxMsgTemplate> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), queryWrapper);

        return page.convert(this::translation);

    }

    /**
     * 构造查询参数
     * @param dto
     * @return
     */
    private LambdaQueryWrapper<WxMsgTemplate> buildQuery(WxMsgTemplatePageDTO dto) {

        boolean isAdmin = sysRoleStaffService.isEnterpriseAdmin();

        LambdaQueryWrapper<WxMsgTemplate> queryWrapper = new QueryWrapper<WxMsgTemplate>().lambda()
                .eq(WxMsgTemplate::getExtCorpId, dto.getExtCorpId())
                .in(ListUtils.isNotEmpty(dto.getCreatorExtIds()), WxMsgTemplate::getCreatorExtId, dto.getCreatorExtIds())
                .ge(dto.getSendTimeStart() != null, WxMsgTemplate::getSendTime, dto.getSendTimeStart())
                .le(dto.getSendTimeEnd() != null, WxMsgTemplate::getSendTime, dto.getSendTimeEnd())
                .eq(!isAdmin, WxMsgTemplate::getCreatorExtId, JwtUtil.getExtUserId());

        queryWrapper.orderByDesc(WxMsgTemplate::getCreatedAt);
        return queryWrapper;
    }

    @Override
    public WxMsgTemplateVO findById(String id){
        return translation(checkExists(id));
    }


    @Override
    public WxMsgTemplate save(WxMsgTemplateSaveDTO dto){

        //封装数据
        WxMsgTemplate wxMsgTemplate = new WxMsgTemplate();
        BeanUtils.copyProperties(dto,wxMsgTemplate);
        wxMsgTemplate.setId(UUID.get32UUID());
        wxMsgTemplate.setCreatedAt(new Date());
        wxMsgTemplate.setUpdatedAt(new Date());
        wxMsgTemplate.setCreatorExtId(JwtUtil.getExtUserId());

        preHandle(wxMsgTemplate);

        //入detail
        WxMsgTemplateCountCustomerDTO countDTO = new WxMsgTemplateCountCustomerDTO();
        BeanUtils.copyProperties(dto, countDTO);

        List<WxMsgTemplateDetail> detailList = getDetailList(countDTO, wxMsgTemplate);

        //没有客户
        if (detailList.isEmpty()) {
            throw new BaseException("");
        }

        //定时的
        if (dto.getHasSchedule()) {
            wxMsgTemplate.setStatus(WxMsgTemplate.STATUS_NO_CREATE);
        }else{
            wxMsgTemplate.setStatus(WxMsgTemplate.STATUS_WAIT);
            //有客户要发送,创建群发任务
            createSendMsgTask(wxMsgTemplate, detailList);
        }

        //入库
        save(wxMsgTemplate);
        detailService.saveBatch(detailList);
        return wxMsgTemplate;
    }

    private List<WxMsgTemplateDetail> getDetailList(WxMsgTemplateCountCustomerDTO countDTO, WxMsgTemplate wxMsgTemplate) {

        List<WxMsgTemplateDetail> detailList = new ArrayList<>();

        //详情
        filterCustomer(countDTO).forEach((staffId, customerIds) ->

                customerIds.forEach(customerId -> {

                    WxMsgTemplateDetail detail = new WxMsgTemplateDetail()
                            .setId(UUID.get32UUID())
                            .setMsgTemplateId(wxMsgTemplate.getId())
                            .setExtCorpId(wxMsgTemplate.getExtCorpId())
                            .setExtStaffId(staffId)
                            .setExtCustomerId(customerId)
                            .setSendStatus(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode())
                            .setCreatedAt(new Date())
                            .setUpdatedAt(new Date());

                    detailList.add(detail);
                }));

        return detailList;
    }

    /**
     * 创建微信群发任务
     * @param wxMsgTemplate
     * @param detailList
     */
    private void createSendMsgTask(WxMsgTemplate wxMsgTemplate, List<WxMsgTemplateDetail> detailList) {

        WxCpMsgTemplate wxCpMsgTemplate = new WxCpMsgTemplate();

        wxCpMsgTemplate.setText(WxMsgUtils.changeToText(wxMsgTemplate.getMsg(), null));

        //创建微信群发任务
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        Map<String, List<WxMsgTemplateDetail>> staffMap = detailList.stream().collect(Collectors.groupingBy(WxMsgTemplateDetail::getExtStaffId));

        List<String> sendCustomerIds = new ArrayList<>();
        
        staffMap.forEach((extStaffId, list) -> {

            //开启了客户去重就每个客户只发一次，没开启就可以发多次
            Stream<WxMsgTemplateDetail> stream;

            if (wxMsgTemplate.getHasDistinct()) {
                stream = list.stream().filter(e -> !sendCustomerIds.contains(e));
            }else{
                stream = list.stream();
            }

            List<String> extCustomerIds = stream.map(WxMsgTemplateDetail::getExtCustomerId).collect(Collectors.toList());

            if (ListUtils.isNotEmpty(extCustomerIds)) {

                //附件
                wxCpMsgTemplate.setAttachments(WxMsgUtils.changeToAttachment(wxMsgTemplate.getMsg(), extStaffId));
                wxCpMsgTemplate.setExternalUserid(extCustomerIds);
                wxCpMsgTemplate.setSender(extStaffId);
                WxCpMsgTemplateAddResult wxCpMsgTemplateAddResult = new WxCpMsgTemplateAddResult();
                String failMsg = null;
                try {
                    wxCpMsgTemplateAddResult = contactService.addMsgTemplate(wxCpMsgTemplate);
                    log.info("[{}]创建群发任务结果=[{}]", JSON.toJSONString(wxCpMsgTemplate), JSON.toJSONString(wxCpMsgTemplateAddResult));
                } catch (WxErrorException e) {
                    log.error("[{}]创建群发任务失败", JSON.toJSONString(wxCpMsgTemplate), e);
                    failMsg = BaseException.getErrorMsgByCode(e.getError().getErrorCode(), "创建失败");
                }
                
                //成功
                sendCustomerIds.addAll(extCustomerIds);

                String msgId = wxCpMsgTemplateAddResult.getMsgId();

                String finalFailMsg = failMsg;
                
                detailList.stream()
                        .filter(e -> e.getExtStaffId().equals(extStaffId))
                        .forEach(e -> {
                            e.setExtMsgId(msgId);
                            if (StringUtils.isNotBlank(finalFailMsg)) {
                                e.setSendStatus(WxMsgTemplate.STATUS_FAIL);
                                e.setFailMsg(finalFailMsg);
                            }
                        });
            }

        });


    }


    @Override
    public WxMsgTemplate update(WxMsgTemplateUpdateDTO dto){

        //校验参数
        WxMsgTemplate wxMsgTemplate = checkExistsAndStatus(dto.getId());

        //封装数据
        BeanUtils.copyProperties(dto, wxMsgTemplate, "createdAt");

        wxMsgTemplate.setUpdatedAt(new Date());

        preHandle(wxMsgTemplate);

        //删除delete，重新入
        detailService.remove(new QueryWrapper<WxMsgTemplateDetail>().lambda()
                .eq(WxMsgTemplateDetail::getMsgTemplateId, wxMsgTemplate.getId()));

        //入detail
        WxMsgTemplateCountCustomerDTO countDTO = new WxMsgTemplateCountCustomerDTO();
        BeanUtils.copyProperties(dto, countDTO);

        List<WxMsgTemplateDetail> detailList = getDetailList(countDTO, wxMsgTemplate);

        //没有客户
        if (detailList.isEmpty()) {
            wxMsgTemplate.setStatus(WxMsgTemplate.STATUS_FAIL);
            updateById(wxMsgTemplate);
            return wxMsgTemplate;
        }

        //定时的
        if (dto.getHasSchedule()) {
            wxMsgTemplate.setStatus(WxMsgTemplate.STATUS_NO_CREATE);
        }else{
            wxMsgTemplate.setStatus(WxMsgTemplate.STATUS_WAIT);
            //有客户要发送,创建群发任务
            createSendMsgTask(wxMsgTemplate, detailList);
        }

        //入库
        updateById(wxMsgTemplate);
        detailService.saveBatch(detailList);
        return wxMsgTemplate;
    }

    /**
     * 数据入库前的处理
     * @param wxMsgTemplate
     */
    private void preHandle(WxMsgTemplate wxMsgTemplate){

        //立即发送的时间是现在
        if (!wxMsgTemplate.getHasSchedule()) {
            wxMsgTemplate.setSendTime(new Date());
        }
        //选择全部员工的处理
        if (wxMsgTemplate.getHasAllStaff()) {
            List<Staff> staffList = staffService.list(new QueryWrapper<Staff>().lambda()
                    .eq(Staff::getExtCorpId, wxMsgTemplate.getExtCorpId()));
            List<String> staffExtIds = staffList.stream().map(Staff::getExtId).collect(Collectors.toList());
            wxMsgTemplate.setStaffIds(staffExtIds);
        }

    }

    /**
     * 翻译
     * @param wxMsgTemplate 实体
     * @return WxMsgTemplateVO 结果集
     * @author xxh
     * @date 2022-02-12
     */
    private WxMsgTemplateVO translation(WxMsgTemplate wxMsgTemplate){
        WxMsgTemplateVO res = new WxMsgTemplateVO();
        BeanUtils.copyProperties(wxMsgTemplate, res);

        //翻译创建者
        Staff staff = staffService.find(wxMsgTemplate.getExtCorpId(), wxMsgTemplate.getCreatorExtId());
        res.setStaff(staff);

        //翻译标签
        res.setChooseTagNames(tagService.getNameByIds(wxMsgTemplate.getChooseTags()));
        res.setExcludeTagNames(tagService.getNameByIds(wxMsgTemplate.getExcludeTags()));
        //翻译群聊名
        if (ListUtils.isNotEmpty(wxMsgTemplate.getChatIds())) {
            
            List<WxGroupChat> wxGroupChats = chatService.list(
                    new QueryWrapper<WxGroupChat>().lambda()
                    .eq(WxGroupChat::getExtCorpId, wxMsgTemplate.getExtCorpId())
                    .in(WxGroupChat::getExtChatId, wxMsgTemplate.getChatIds())
            );
            List<String> chatNames = wxGroupChats.stream().map(WxGroupChat::getName).collect(Collectors.toList());
            res.setChatNames(chatNames);

        }

        //详情
        List<WxMsgTemplateDetail> detailList = detailService.list(new QueryWrapper<WxMsgTemplateDetail>().lambda()
                .eq(WxMsgTemplateDetail::getMsgTemplateId, wxMsgTemplate.getId()));

        if (ListUtils.isEmpty(detailList)) {
            return res;
        }

        //更新有没有发送消息
        queryDetail(detailList);

        //拿到详情的客户和员工信息id，查出它们的信息,
        List<String> customerExtIdList = detailList.stream()
                .map(WxMsgTemplateDetail::getExtCustomerId)
                .collect(Collectors.toList());

        //员工信息
        List<Staff> staffList = staffService.list(new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, wxMsgTemplate.getExtCorpId())
                .in(Staff::getExtId, wxMsgTemplate.getStaffIds()));

        Map<String, Staff> staffMap = staffList.stream()
                .collect(Collectors.toMap(Staff::getExtId, Function.identity()));

        //客户信息
        List<WxCustomer> customerList = wxCustomerService.list(new QueryWrapper<WxCustomer>().lambda()
                .eq(WxCustomer::getExtCorpId, wxMsgTemplate.getExtCorpId())
                .in(WxCustomer::getExtId, customerExtIdList));

        Map<String, WxCustomer> customerMap = customerList.stream()
                .collect(Collectors.toMap(WxCustomer::getExtId, Function.identity()));

        //封装客户详情
        List<WxMsgTemplateDetailDTO> customerDtoList = new ArrayList<>();
        
        for (WxMsgTemplateDetail detail : detailList) {

            WxMsgTemplateDetailDTO dto = new WxMsgTemplateDetailDTO();
            BeanUtils.copyProperties(detail, dto);

            dto.setStaffName(
                    staffMap.getOrDefault(dto.getExtStaffId(), new Staff()).getName());
            WxCustomer customer = customerMap.getOrDefault(dto.getExtCustomerId(), new WxCustomer());
            dto.setCustomerName(customer.getName());
            dto.setCustomerAvatarUrl(customer.getAvatar());
            dto.setCorpName(customer.getCorpName());

            customerDtoList.add(dto);

            //计数
            switch (WxMsgSendStatusEnum.getByCode(dto.getSendStatus())){
                case STATUS_NO_SEND:
                    res.setNoSendCustomer(res.getNoSendCustomer() + 1);
                    break;
                case STATUS_SEND:
                    res.setSendCustomer(res.getSendCustomer() + 1);
                    break;
                case STATUS_NO_FRIEND:
                    res.setNoSendCustomer(res.getNoSendCustomer() + 1);
                    res.setNoFriendCustomer(res.getNoFriendCustomer() + 1);
                    break;
                case STATUS_OTHER_SEND:
                    res.setNoSendCustomer(res.getNoSendCustomer() + 1);
                    res.setOtherSendCustomer(res.getOtherSendCustomer() + 1);
                    break;
                default:
            }
            
        }

        List<WxMsgTemplateStaffDTO> staffDetails = getStaffDetails(wxMsgTemplate.getStaffIds(), detailList);
        int send = 0;
        int noSend = 0;
        for (WxMsgTemplateStaffDTO staffDetail : staffDetails) {
            if (staffDetail.getStatus().equals(WxMsgSendStatusEnum.STATUS_SEND.getCode())) {
                send ++;
            }else{
                noSend++;
            }
        }

        res.setCustomerList(customerDtoList);
        res.setStaffList(staffDetails);
        res.setSendStaffCount(send);
        res.setNoSendStaffCount(noSend);
        return res;
    }
    
    private List<WxMsgTemplateStaffDTO> getStaffDetails(List<String> allStaffIds, List<WxMsgTemplateDetail> detailList){

        String extCorpId = detailList.get(0).getExtCorpId();

        Map<String, List<WxMsgTemplateDetail>> staffDetailMap = detailList.stream()
                .collect(Collectors.groupingBy(WxMsgTemplateDetail::getExtStaffId));
        
        
        
        //封装员工详情
        List<WxMsgTemplateStaffDTO> result = new ArrayList<>();

        staffDetailMap.forEach((staffId, details) -> {

            WxMsgTemplateStaffDTO dto = new WxMsgTemplateStaffDTO();
            result.add(dto);


            Staff staffInfo = staffService.find(extCorpId, staffId);
            BeanUtils.copyProperties(staffInfo, dto);
            dto.setCustomerCount(details.size());

            //统计员工的发送情况
            int send = 0;
            int noSend = 0;
            int exception = 0;

            for (WxMsgTemplateDetail detail : details) {

                if (WxMsgSendStatusEnum.STATUS_NO_SEND.getCode().equals(detail.getSendStatus())) {
                    noSend ++;
                }else if(WxMsgSendStatusEnum.STATUS_EXCEPTION.getCode().equals(detail.getSendStatus())){
                    exception ++;
                }else{
                    //不是好友和接收上限也算已发送
                    send ++;
                }
            }

            //改成成功发送一个都算已发送，其他算未发送
            if (send > 0) {
                dto.setStatus(WxMsgSendStatusEnum.STATUS_SEND.getCode());
            }else if(exception > 0){
                dto.setStatus(WxMsgSendStatusEnum.STATUS_EXCEPTION.getCode());
            }else {
                dto.setStatus(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode());
            }
        });

        //把没朋友的也加进去
//        for (String staffId : allStaffIds) {
//
//            if (!staffDetailMap.containsKey(staffId)) {
//
//                WxMsgTemplateStaffDTO dto = new WxMsgTemplateStaffDTO();
//                result.add(dto);
//                
//                Staff staffInfo = staffService.find(extCorpId, staffId);
//                
//                BeanUtils.copyProperties(staffInfo, dto);
//
//                dto.setCustomerCount(0);
//                dto.setStatus(WxMsgSendStatusEnum.STATUS_NO_FRIEND.getCode());
//                
//            }
//
//        }
        
        return result;
        
    }

    /**
     * 检查有没有发送消息
     * @param detailList
     */
    private void queryDetail(List<WxMsgTemplateDetail> detailList) {

        //根据msgId分组
        Map<String, List<WxMsgTemplateDetail>> msgMap = detailList.stream()
                .filter(e -> Objects.equals(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode(), e.getSendStatus())
                        && StringUtils.isNotBlank(e.getExtMsgId()))
                .collect(Collectors.groupingBy(WxMsgTemplateDetail::getExtMsgId));

        //查询发送结果
        WxCpExternalContactServiceImpl externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        msgMap.forEach((msgId, details) -> {

            //获取发送结果
            List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> sendResult = getSendResult(externalContactService, msgId, details.get(0).getExtStaffId(), 1000, null);

            //按客户id分组
            Map<String, WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> sendResultMap = sendResult.stream().collect(Collectors.toMap(WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo::getExternalUserId, Function.identity(), (k1, k2) -> k1));

            //更新到我们的数据库
            details.forEach(e -> {

                WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo info = sendResultMap.get(e.getExtCustomerId());
                if (info != null) {

                    e.setSendStatus(info.getStatus());
                    if (info.getSendTime() != null) {
                        e.setSendTime(new Date(info.getSendTime() * 1000));
                    }
                }

            });
        });


        detailService.updateBatchById(detailList);
    }

    @Override
    public List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> getSendResult(WxCpExternalContactServiceImpl externalContactService,
                                                                                       String msgId, String staffId, Integer limit, String cursor) {

        WxCpGroupMsgSendResult sendResult;

        try {
            sendResult  = externalContactService.getGroupMsgSendResult(msgId, staffId, limit, cursor);
        } catch (WxErrorException e) {
            log.error("[客户群发]，获取发送结果失败，参数=[{}], [{}], [{}], [{}]", msgId, staffId, limit, cursor, e);
            return new ArrayList<>();
        }

        List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> result = new ArrayList<>(sendResult.getSendList());
        //递归拿分页结果
        if (StringUtils.isNotBlank(sendResult.getNextCursor())) {

            List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> nextResult =
                    getSendResult(externalContactService, msgId, staffId, limit, sendResult.getNextCursor());

            if (ListUtils.isNotEmpty(nextResult)) {
                result.addAll(nextResult);
            }
        }
        return result;
    }

    @Override
    public String commonSendMsg(WxMsgDTO msgDTO, String extStaffId, List<String> extCustomerIds, String extCorpId) {

        WxCpMsgTemplate wxCpMsgTemplate = new WxCpMsgTemplate();

        wxCpMsgTemplate.setText(WxMsgUtils.changeToText(msgDTO, null));

        //创建微信群发任务
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getWxCpService());

        //附件
        wxCpMsgTemplate.setAttachments(WxMsgUtils.changeToAttachment(msgDTO, extStaffId));
        wxCpMsgTemplate.setExternalUserid(extCustomerIds);
        wxCpMsgTemplate.setSender(extStaffId);
        WxCpMsgTemplateAddResult wxCpMsgTemplateAddResult;
        try {
            wxCpMsgTemplateAddResult = contactService.addMsgTemplate(wxCpMsgTemplate);
            log.info("[{}]创建群发任务结果=[{}]", JSON.toJSONString(wxCpMsgTemplate), JSON.toJSONString(wxCpMsgTemplateAddResult));
        } catch (WxErrorException e) {
            log.error("[{}]创建群发任务失败", JSON.toJSONString(wxCpMsgTemplate), e);
            throw BaseException.buildBaseException(e.getError(), "创建群发任务失败");
        }

        return wxCpMsgTemplateAddResult.getMsgId();

    }

    @Override
    public WxMsgTemplate savePerson(WxPersonTemplateSaveDTO dto) throws WxErrorException {

        //找五分钟内的个人群发，创建者是这个人
        List<WxCpGroupMsgListResult.ExternalContactGroupMsgInfo> msgList = getGroupMsgList(dto.getExtCorpId(), "single", DateUtils.operationDate(Calendar.MINUTE, -5), new Date(), JwtUtil.getExtUserId(), 2, null);

        if (msgList.stream().noneMatch(e -> e.getText().equals(WxMsgUtils.changeToText(dto.getMsg(), null)))) {
            log.error("找不到该创建者对应的群发记录，[{}], [{}], [{}], [{}], [{}]", dto.getExtCorpId(), DateUtils.operationDate(Calendar.MINUTE, -5), new Date(), JwtUtil.getExtUserId(), JSON.toJSONString(msgList));
            throw new BaseException("找不到该创建者对应的群发记录");
        }
        
        WxCpGroupMsgListResult.ExternalContactGroupMsgInfo msgInfo = msgList.stream().filter(e -> e.getText().equals(WxMsgUtils.changeToText(dto.getMsg(), null)))
                .max(Comparator.comparing(WxCpGroupMsgListResult.ExternalContactGroupMsgInfo::getCreateTime)).get();

        //拿到所有发送人
        List<WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo> groupMsgTask = getGroupMsgTask(dto.getExtCorpId(), msgInfo.getMsgId(), null, 2);

        //封装数据
        String jobId = UUID.get32UUID();
        List<WxMsgTemplateDetail> detailList = new ArrayList<>();

        for (WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo msg : groupMsgTask) {

            List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> sendResult = getGroupMsgSendResult(dto.getExtCorpId(), msgInfo.getMsgId(), msg.getUserId(), null);
            
            sendResult.forEach(send -> {

                Date sendTime = send.getSendTime() == null ? null : new Date(send.getSendTime() * 1000);

                WxMsgTemplateDetail wxMsgTemplateDetail = new WxMsgTemplateDetail()
                        .setId(UUID.get32UUID())
                        .setExtCorpId(dto.getExtCorpId())
                        .setMsgTemplateId(jobId)
                        .setExtStaffId(msg.getUserId())
                        .setExtCustomerId(send.getExternalUserId())
                        .setSendStatus(send.getStatus())
                        .setSendTime(sendTime)
                        .setExtMsgId(msgInfo.getMsgId())
                        .setCreatedAt(new Date())
                        .setUpdatedAt(new Date());
                detailList.add(wxMsgTemplateDetail);
            });
        }

        List<String> staffIds = detailList.stream().map(WxMsgTemplateDetail::getExtStaffId).distinct().collect(Collectors.toList());

        WxMsgTemplate wxMsgTemplate = new WxMsgTemplate()
                .setId(jobId)
                .setExtCorpId(dto.getExtCorpId())
                .setMsg(dto.getMsg())
                .setName(dto.getName())
                .setCreatorExtId(JwtUtil.getExtUserId())
                .setHasSchedule(false)
                .setSendTime(new Date())
                .setHasPerson(true)
                .setHasAllStaff(false)
                .setStaffIds(staffIds)
                .setHasAllCustomer(false)
                .setHasDistinct(false)
                .setStatus(WxMsgTemplate.STATUS_WAIT)
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date());
        
        save(wxMsgTemplate);
        detailService.saveBatch(detailList);
        return wxMsgTemplate;
    }

    @Override
    public List<WxCpGroupMsgListResult.ExternalContactGroupMsgInfo> getGroupMsgList(String extCorpId, String chatType, Date startTime, Date endTime, String creator, Integer filterType, String cursor) throws WxErrorException {
        //查询群发任务
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getWxCpService());

        WxCpGroupMsgListResult msgListResult = contactService.getGroupMsgListV2(chatType, startTime, endTime, creator, filterType, 100, cursor);

        List<WxCpGroupMsgListResult.ExternalContactGroupMsgInfo> result = msgListResult.getGroupMsgList();

        if (StringUtils.isNotBlank(msgListResult.getNextCursor())) {
            result.addAll(getGroupMsgList(extCorpId, chatType, startTime, endTime, creator, filterType, msgListResult.getNextCursor()));
        }
        
        return result;
    }

    @Override
    public List<WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo> getGroupMsgTask(String extCorpId, String msgId, String cursor, Integer retrySeconds) throws WxErrorException {
        
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getWxCpService());

        WxCpGroupMsgTaskResult groupMsgTask = null;
        try {
            groupMsgTask = contactService.getGroupMsgTask(msgId, 1000, cursor);
        } catch (WxErrorException e) {
            //重试,小于3分钟都可以等
            if (Objects.equals(e.getError().getErrorCode(), WxErrorEnum.CODE_41063.getCode()) && retrySeconds < 180) {
                DelayUtils.delaySeconds(retrySeconds);
                return getGroupMsgTask(extCorpId, msgId, cursor, retrySeconds * 2);
            }else{
                throw e;
            }
        }

        List<WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo> result = groupMsgTask.getTaskList();

        if (StringUtils.isNotBlank(groupMsgTask.getNextCursor())) {
            result.addAll(getGroupMsgTask(extCorpId, msgId, groupMsgTask.getNextCursor(), retrySeconds));
        }
        
        return result;
    }

    @Override
    public List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> getGroupMsgSendResult(String extCorpId, String msgId, String staffId, String cursor) throws WxErrorException {

        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getWxCpService());

        WxCpGroupMsgSendResult groupMsgSendResult = contactService.getGroupMsgSendResult(msgId, staffId, 1000, cursor);

        List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> result = groupMsgSendResult.getSendList();

        if (StringUtils.isNotBlank(groupMsgSendResult.getNextCursor())) {
            result.addAll(getGroupMsgSendResult(extCorpId, msgId, staffId, groupMsgSendResult.getNextCursor()));
        }

        return result;
    }

    @Override
    public List<WxMsgTemplateStaffDTO> getStaffByStatus(TemplateFilterDTO dto) {
        WxMsgTemplate template = checkExists(dto.getId());
        List<WxMsgTemplateDetail> details = detailService.list(new QueryWrapper<WxMsgTemplateDetail>().lambda()
                .eq(WxMsgTemplateDetail::getExtCorpId, template.getExtCorpId())
                .eq(WxMsgTemplateDetail::getMsgTemplateId, dto.getId()));

        List<WxMsgTemplateStaffDTO> result = getStaffDetails(template.getStaffIds(), details);
        
        //筛状态
        if (ListUtils.isNotEmpty(dto.getStatusList()) && ListUtils.isNotEmpty(result)) {
            result = result.stream().filter(e -> dto.getStatusList().contains(e.getStatus())).collect(Collectors.toList());
        }
        
        //筛选人名
        if (StringUtils.isNotBlank(dto.getName()) && ListUtils.isNotEmpty(result)) {

            List<String> list = staffService.contactSearch(template.getExtCorpId(), dto.getName());
            if (ListUtils.isEmpty(list)) {
                return new ArrayList<>();
            }
            result = result.stream().filter(e -> list.contains(e.getExtId())).collect(Collectors.toList());
        }
        return result;
    }

    @Override
    public void deleteById(String id) {
        removeById(id);
        detailService.remove(new QueryWrapper<WxMsgTemplateDetail>().lambda().eq(WxMsgTemplateDetail::getMsgTemplateId, id));
    }
    
    private WxMsgTemplate checkExistsAndStatus(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxMsgTemplate byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户群发不存在");
        }
        if (!WxMsgTemplate.STATUS_NO_CREATE.equals(byId.getStatus())) {
            throw new BaseException("该任务不允许修改！");
        }
        return byId;
    }

    @Override
    public WxMsgTemplate checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxMsgTemplate byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户群发不存在");
        }
        return byId;
    }

    @Override
    public Integer countCustomer(WxMsgTemplateCountCustomerDTO dto) {
        Map<String, List<String>> staffCustomerMap = filterCustomer(dto);
        Set<String> customerIdSet = new HashSet<>();
        for (List<String> customerList : staffCustomerMap.values()) {
            customerIdSet.addAll(customerList);
        }
        return customerIdSet.size();
    }

    @Override
    public WxMsgTemplate cancel(String id) {

        //校验参数
        WxMsgTemplate wxMsgTemplate = checkExistsAndStatus(id);

        wxMsgTemplate.setStatus(WxMsgTemplate.STATUS_CANCEL);

        updateById(wxMsgTemplate);

        return wxMsgTemplate;
    }

    @Override
    public void exportCustomer(MsgTemplateExportVO vo, HttpServletRequest request, HttpServletResponse response) {
        WxMsgTemplateVO msgTemplateVO = findById(vo.getTemplateId());

        //获取符合条件的客户
        List<WxMsgTemplateDetailDTO> customerList = msgTemplateVO.getCustomerList();

        if (vo.getStatus() != null) {

            customerList = customerList.stream().filter(e -> vo.getStatus().equals(e.getSendStatus())).collect(Collectors.toList());

        }

        List<MsgTemplateCustomerExportDTO> exportData = customerList.stream().map(e -> {
            MsgTemplateCustomerExportDTO exportDTO = new MsgTemplateCustomerExportDTO(e);
//            exportDTO.setStaffName("$userName=" + e.getExtStaffId() + "$");
            return exportDTO;
        }).collect(Collectors.toList());

        //获取导出标题
        String title = getCustomerExportTitle(vo.getTemplateId());

        EasyPoiUtils.export("客户群发-" + vo.getStatusCN(), title, null,
                MsgTemplateCustomerExportDTO.class, exportData);
    }

    /**
     * 获取客户到处的标题
     * @param templateId
     * @return
     */
    private String getCustomerExportTitle(String templateId) {

        WxMsgTemplate wxMsgTemplate = getById(templateId);

        SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd HH:mm");

        return String.format("客户群发——客户接收详情（导出时间：%s）\n" +
                "发送时间：%s", sdf.format(new Date()), sdf.format(wxMsgTemplate.getSendTime()));
    }

    @Override
    public void exportStaff(MsgTemplateExportVO vo, HttpServletRequest request, HttpServletResponse response) {

        WxMsgTemplateVO msgTemplateVO = findById(vo.getTemplateId());

        //获取符合条件的客户
        List<WxMsgTemplateStaffDTO> staffList = msgTemplateVO.getStaffList();

        if (vo.getStatus() != null) {

            staffList = staffList.stream().filter(e -> vo.getStatus().equals(e.getStatus())).collect(Collectors.toList());

        }

        List<MsgTemplateStaffExportDTO> exportData = staffList.stream().map(e -> {
            MsgTemplateStaffExportDTO exportDTO = new MsgTemplateStaffExportDTO(e);
//            exportDTO.setName("$userName=" + e.getExtId() + "$");
            return exportDTO;
        }).collect(Collectors.toList());

        //获取导出标题
        String title = getStaffExportTitle(vo.getTemplateId());

        EasyPoiUtils.export("客户群发-" + vo.getStatusCN(), title, null,
                MsgTemplateStaffExportDTO.class, exportData);

    }

    private String getStaffExportTitle(String templateId) {

        WxMsgTemplate wxMsgTemplate = getById(templateId);

        SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd HH:mm");

        return String.format("客户群发——成员发送详情（导出时间：%s）\n" +
                "发送时间：%s", sdf.format(new Date()), sdf.format(wxMsgTemplate.getSendTime()));
    }

    @Override
    public void remind(WxMsgTemplateRemindDTO dto) {

        //未发送的详情状态
        List<Integer> noSendStatus = new ArrayList<>();
        noSendStatus.add(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode());
        noSendStatus.add(WxMsgSendStatusEnum.STATUS_OTHER_SEND.getCode());

        //必须的查询
        LambdaQueryWrapper<WxMsgTemplateDetail> queryWrapper = new QueryWrapper<WxMsgTemplateDetail>().lambda()
                .eq(WxMsgTemplateDetail::getExtCorpId, dto.getExtCorpId())
                .eq(WxMsgTemplateDetail::getMsgTemplateId, dto.getTemplateId())
                .in(WxMsgTemplateDetail::getSendStatus, noSendStatus);

        //员工查询条件
        if (StringUtils.isNotBlank(dto.getStaffExtId())) {
            queryWrapper.eq(WxMsgTemplateDetail::getExtStaffId, dto.getStaffExtId());
        }

        List<WxMsgTemplateDetail> details = detailService.list(queryWrapper);

        if (ListUtils.isEmpty(details)) {
            throw new BaseException("没有需要提醒的员工！");
        }

        //发送应用消息
        Set<String> staffIds = details.stream().map(WxMsgTemplateDetail::getExtStaffId).collect(Collectors.toSet());

        //获取发送内容
        WxMsgTemplate wxMsgTemplate = getById(dto.getTemplateId());

        String content = String.format(REMAIN_TIPS,
                new SimpleDateFormat("YYYY-MM-dd HH:mm").format(wxMsgTemplate.getSendTime()));

        WxMsgUtils.sendMessage(dto.getExtCorpId(), content, staffIds);

    }

    @Override
    public void scanMsgTemplate() {

        List<WxMsgTemplate> list = list(new QueryWrapper<WxMsgTemplate>().lambda()
                .eq(WxMsgTemplate::getStatus, WxMsgTemplate.STATUS_NO_CREATE)
                .le(WxMsgTemplate::getSendTime, new Date()));

        if (list.isEmpty()) {
            return;
        }

        for (WxMsgTemplate msgTemplate : list) {

            try {

                List<WxMsgTemplateDetail> details = detailService.list(new QueryWrapper<WxMsgTemplateDetail>().lambda()
                        .eq(WxMsgTemplateDetail::getMsgTemplateId, msgTemplate.getId()));

                msgTemplate.setStatus(WxMsgTemplate.STATUS_WAIT);
                
                createSendMsgTask(msgTemplate, details);

                updateById(msgTemplate);

                detailService.updateBatchById(details);
                
            }catch (Exception e){
                log.error("[{}]定时创建群发任务失败， ", JSON.toJSONString(msgTemplate), e);
            }
        }

    }

    private Map<String, List<String>> filterCustomer(WxMsgTemplateCountCustomerDTO dto) {
        //获取符合条件的客户id
        List<String> customerIds = new ArrayList<>();
        List<WxCustomer> customerList = wxCustomerService.getCustomerListByCondition(dto);
        if (ListUtils.isNotEmpty(customerList)){
            customerIds = customerList.stream().map(WxCustomer::getExtId).collect(Collectors.toList());
        }
        if (ListUtils.isEmpty(customerIds)) {
            return new HashMap<>();
        }

        //查询客户是哪个员工的
        List<WxCustomerStaff> customerStaffList = wxCustomerStaffService.list(new QueryWrapper<WxCustomerStaff>().lambda()
                .in(WxCustomerStaff::getExtCustomerId, customerIds));
        
        //封装结果
        Map<String, List<String>> result = new HashMap<>();
        for (WxCustomerStaff wxCustomerStaff : customerStaffList) {

            //说明不统计这个员工的信息
            if (!dto.getHasAllStaff() && !dto.getStaffIds().contains(wxCustomerStaff.getExtStaffId())) {
                continue;
            }

            //在开始时间前添加的不统计在内
            if (dto.getAddStartTime() != null 
                    && wxCustomerStaff.getCreateTime().before(dto.getAddStartTime())) {
                continue;
            }

            //在结束时间后添加的不统计在内
            if (dto.getAddEndTime() != null
                    && wxCustomerStaff.getCreateTime().after(dto.getAddEndTime())) {
                continue;
            }

            List<String> staffCustomerIds = result.computeIfAbsent(wxCustomerStaff.getExtStaffId(), k -> new ArrayList<>());
            staffCustomerIds.add(wxCustomerStaff.getExtCustomerId());
        }
        return result;
    }

}
