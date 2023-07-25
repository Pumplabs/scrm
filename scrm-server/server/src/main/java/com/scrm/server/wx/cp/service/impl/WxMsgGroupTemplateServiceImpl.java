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
import com.scrm.api.wx.cp.vo.IdVO;
import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.api.wx.cp.vo.WxMsgGroupTemplateVO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.UUID;
import com.scrm.common.util.*;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.mapper.WxMsgGroupTemplateMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import com.scrm.server.wx.cp.utils.WxTranslateExportUtils;
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
import java.util.stream.Collectors;

/**
 * 客户群聊-群发消息 服务实现类
 *
 * @author xxh
 * @since 2022-03-02
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxMsgGroupTemplateServiceImpl extends ServiceImpl<WxMsgGroupTemplateMapper, WxMsgGroupTemplate> implements IWxMsgGroupTemplateService {

    @Autowired
    private IWxMsgTemplateService msgTemplateService;

    @Autowired
    private IWxMsgGroupTemplateDetailService detailService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IStaffDepartmentService staffDepartmentService;

    @Autowired
    private IDepartmentService departmentService;

    @Autowired
    private IWxGroupChatService chatService;

    @Autowired
    private IWxGroupChatMemberService wxGroupChatMemberService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    private final String GROUP_TYPE = "group";

    private final String REMAIN_TIPS = "【任务提醒】有新的任务啦！\n" +
            "\n" +
            "任务类型：群发任务\n" +
            "\n" +
            "创建时间：%s\n" +
            "\n" +
            "可前往【客户群】中确认发送，记得及时完成哦";

    @Override
    public IPage<WxMsgGroupTemplateVO> pageList(WxMsgGroupTemplatePageDTO dto) {
        LambdaQueryWrapper<WxMsgGroupTemplate> queryWrapper = buildQuery(dto);
        IPage<WxMsgGroupTemplate> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), queryWrapper);
        return page.convert(this::translation);
    }

    private LambdaQueryWrapper<WxMsgGroupTemplate> buildQuery(WxMsgGroupTemplatePageDTO dto) {

        return new QueryWrapper<WxMsgGroupTemplate>().lambda()
                .eq(WxMsgGroupTemplate::getExtCorpId, dto.getExtCorpId())
                .like(StringUtils.isNotBlank(dto.getName()), WxMsgGroupTemplate::getName, dto.getName())
                .in(ListUtils.isNotEmpty(dto.getCreatorExtIds()), WxMsgGroupTemplate::getCreatorExtId, dto.getCreatorExtIds())
                .ge(dto.getSendTimeStart() != null, WxMsgGroupTemplate::getSendTime, dto.getSendTimeStart())
                .le(dto.getSendTimeEnd() != null, WxMsgGroupTemplate::getSendTime, dto.getSendTimeEnd())
                .orderByDesc(WxMsgGroupTemplate::getCreatedAt);
    }

    @Override
    public WxMsgGroupTemplateVO findById(String id) {
        return translation(getById(id));
    }


    @Override
    public WxMsgGroupTemplate save(WxMsgGroupTemplateSaveDTO dto) {

        checkNameRepeat(null, dto.getExtCorpId(), dto.getName());

        //封装数据
        WxMsgGroupTemplate wxMsgGroupTemplate = new WxMsgGroupTemplate();
        BeanUtils.copyProperties(dto, wxMsgGroupTemplate);
        wxMsgGroupTemplate.setId(UUID.get32UUID());
        wxMsgGroupTemplate.setCreatedAt(new Date());
        wxMsgGroupTemplate.setUpdatedAt(new Date());
        wxMsgGroupTemplate.setCreatorExtId(JwtUtil.getExtUserId());

        preHandle(wxMsgGroupTemplate);

        List<WxMsgGroupTemplateDetail> detailList = getDetailList(wxMsgGroupTemplate);

        if (detailList.isEmpty()) {
            wxMsgGroupTemplate.setStatus(WxMsgTemplate.STATUS_FAIL);
            save(wxMsgGroupTemplate);
            return wxMsgGroupTemplate;
        }

        //定时的
        if (dto.getHasSchedule()) {
            wxMsgGroupTemplate.setStatus(WxMsgTemplate.STATUS_NO_CREATE);
        } else {
            wxMsgGroupTemplate.setStatus(WxMsgTemplate.STATUS_WAIT);
            //有客户要发送,创建群发任务
            createSendMsgTask(wxMsgGroupTemplate, detailList);
        }

        save(wxMsgGroupTemplate);
        detailService.saveBatch(detailList);
        return wxMsgGroupTemplate;
    }

    private void checkNameRepeat(String id, String extCorpId, String name) {

        if (count(new QueryWrapper<WxMsgGroupTemplate>().lambda()
                .ne(StringUtils.isNotBlank(id), WxMsgGroupTemplate::getId, id)
                .eq(WxMsgGroupTemplate::getExtCorpId, extCorpId)
                .eq(WxMsgGroupTemplate::getName, name)) > 0) {
            throw new BaseException("该群发名称已存在！");
        }

    }

    private void createSendMsgTask(WxMsgGroupTemplate wxMsgGroupTemplate, List<WxMsgGroupTemplateDetail> detailList) {

        WxCpMsgTemplate wxCpMsgTemplate = new WxCpMsgTemplate();

        wxCpMsgTemplate.setText(WxMsgUtils.changeToText(wxMsgGroupTemplate.getMsg(), null));

        //类型
        wxCpMsgTemplate.setChatType(GROUP_TYPE);

        //创建微信群发任务
        WxCpExternalContactService contactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        Map<String, List<WxMsgGroupTemplateDetail>> staffMap = detailList.stream().collect(Collectors.groupingBy(WxMsgGroupTemplateDetail::getExtStaffId));

        staffMap.forEach((extStaffId, list) -> {

            //附件
            wxCpMsgTemplate.setAttachments(WxMsgUtils.changeToAttachment(wxMsgGroupTemplate.getMsg(), extStaffId));
            wxCpMsgTemplate.setSender(extStaffId);
            try {
                WxCpMsgTemplateAddResult wxCpMsgTemplateAddResult = contactService.addMsgTemplate(wxCpMsgTemplate);
                log.info("[{}]创建微信群群发任务结果=[{}]", JSON.toJSONString(wxCpMsgTemplate), JSON.toJSONString(wxCpMsgTemplateAddResult));

                list.forEach(e -> {
                    e.setExtMsgId(wxCpMsgTemplateAddResult.getMsgId());
                });

            } catch (WxErrorException | RuntimeException e) {
                log.error("[{}]创建微信群群发任务失败", JSON.toJSONString(wxCpMsgTemplate), e);
            }

        });
    }

    private List<WxMsgGroupTemplateDetail> getDetailList(WxMsgGroupTemplate wxMsgGroupTemplate) {

        List<WxGroupChat> chatList = chatService.list(new QueryWrapper<WxGroupChat>().lambda()
                .eq(WxGroupChat::getExtCorpId, wxMsgGroupTemplate.getExtCorpId())
                .in(WxGroupChat::getOwner, wxMsgGroupTemplate.getExtStaffIds()));

        if (ListUtils.isEmpty(chatList)) {
            return new ArrayList<>();
        }

        return chatList.stream().map(e ->
                new WxMsgGroupTemplateDetail()
                        .setId(UUID.get32UUID())
                        .setExtCorpId(wxMsgGroupTemplate.getExtCorpId())
                        .setMsgTemplateId(wxMsgGroupTemplate.getId())
                        .setExtStaffId(e.getOwner())
                        .setExtChatId(e.getExtChatId())
                        .setSendStatus(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode())
                        .setCreatedAt(new Date())
                        .setUpdatedAt(new Date())).collect(Collectors.toList());
    }

    private void preHandle(WxMsgGroupTemplate wxMsgGroupTemplate) {

        //立即发送的时间是现在
        if (!wxMsgGroupTemplate.getHasSchedule()) {
            wxMsgGroupTemplate.setSendTime(new Date());
        }
        //选择全部员工的处理
        if (wxMsgGroupTemplate.getHasAllStaff()) {
            List<Staff> staffList = staffService.list();
            List<String> staffExtIds = staffList.stream().map(Staff::getExtId).collect(Collectors.toList());
            wxMsgGroupTemplate.setExtStaffIds(staffExtIds);
        }

    }


    @Override
    public WxMsgGroupTemplate update(WxMsgGroupTemplateUpdateDTO dto) {

        //校验参数
        WxMsgGroupTemplate wxMsgGroupTemplate = checkExists(dto.getId());

        checkNameRepeat(dto.getId(), wxMsgGroupTemplate.getExtCorpId(), dto.getName());

        //封装数据
        BeanUtils.copyProperties(dto, wxMsgGroupTemplate, "createdAt");

        wxMsgGroupTemplate.setUpdatedAt(new Date());

        preHandle(wxMsgGroupTemplate);

        //删除delete，重新入
        detailService.remove(new QueryWrapper<WxMsgGroupTemplateDetail>().lambda()
                .eq(WxMsgGroupTemplateDetail::getMsgTemplateId, wxMsgGroupTemplate.getId()));

        List<WxMsgGroupTemplateDetail> detailList = getDetailList(wxMsgGroupTemplate);

        if (detailList.isEmpty()) {
            wxMsgGroupTemplate.setStatus(WxMsgTemplate.STATUS_FAIL);
            updateById(wxMsgGroupTemplate);
            return wxMsgGroupTemplate;
        }

        //定时的
        if (dto.getHasSchedule()) {
            wxMsgGroupTemplate.setStatus(WxMsgTemplate.STATUS_NO_CREATE);
        } else {
            wxMsgGroupTemplate.setStatus(WxMsgTemplate.STATUS_WAIT);
            //有客户要发送,创建群发任务
            createSendMsgTask(wxMsgGroupTemplate, detailList);
        }

        updateById(wxMsgGroupTemplate);
        detailService.saveBatch(detailList);

        return wxMsgGroupTemplate;
    }

    /**
     * 翻译
     *
     * @param wxMsgGroupTemplate 实体
     * @return WxMsgGroupTemplateVO 结果集
     * @author xxh
     * @date 2022-03-02
     */
    private WxMsgGroupTemplateVO translation(WxMsgGroupTemplate wxMsgGroupTemplate) {
        WxMsgGroupTemplateVO res = new WxMsgGroupTemplateVO();
        BeanUtils.copyProperties(wxMsgGroupTemplate, res);

        //翻译创建者
        res.setCreatorInfo(staffService.find(wxMsgGroupTemplate.getExtCorpId(), wxMsgGroupTemplate.getCreatorExtId()));

        //查询最新的详情
        List<WxMsgGroupTemplateDetail> details = updateDetail(wxMsgGroupTemplate.getExtCorpId(), wxMsgGroupTemplate.getId());

        Map<String, List<Integer>> staffMap = new HashMap<>();
        Map<String, List<Integer>> chatMap = new HashMap<>();

        for (WxMsgGroupTemplateDetail detail : details) {

            List<Integer> staffStatusList = staffMap.computeIfAbsent(detail.getExtStaffId(), k -> new ArrayList<>());
            List<Integer> chatStatusList = chatMap.computeIfAbsent(detail.getExtStaffId(), k -> new ArrayList<>());

            staffStatusList.add(detail.getSendStatus());
            chatStatusList.add(detail.getSendStatus());
        }

        staffMap.forEach((id, statusList) -> {

            if (statusList.stream().allMatch(e -> WxMsgSendStatusEnum.STATUS_SEND.getCode().equals(e))) {
                res.setSendStaffCount(res.getSendStaffCount() + 1);
            } else {
                res.setNoSendStaffCount(res.getNoSendStaffCount() + 1);
            }

        });

        chatMap.values().forEach(chatStatusList -> {

            chatStatusList.forEach(e -> {

                if (WxMsgSendStatusEnum.STATUS_SEND.getCode().equals(e)) {
                    res.setSendChatCount(res.getSendChatCount() + 1);
                } else {
                    res.setNoSendChatCount(res.getNoSendChatCount() + 1);
                }

            });
        });

        //翻译群聊信息
        if (!chatMap.isEmpty()) {
            List<WxGroupChat> wxGroupChats = Optional.ofNullable(chatService.listByIds(chatMap.keySet())).orElse(new ArrayList<>());
            res.setChatNames(wxGroupChats);
        }
        return res;
    }

    /**
     * 更新详情数据
     *
     * @param id
     * @return
     */
    private List<WxMsgGroupTemplateDetail> updateDetail(String corpId, String id) {

        List<WxMsgGroupTemplateDetail> templateDetails = detailService.list(new QueryWrapper<WxMsgGroupTemplateDetail>().lambda()
                .eq(WxMsgGroupTemplateDetail::getExtCorpId, corpId)
                .eq(WxMsgGroupTemplateDetail::getMsgTemplateId, id));

        //查出全部msgId
        Set<String> noSendMsgIdSet = new HashSet<>();
        List<WxMsgGroupTemplateDetail> result = new ArrayList<>();
        for (WxMsgGroupTemplateDetail detail : templateDetails) {
            if (Objects.equals(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode(), detail.getSendStatus()) &&
                    StringUtils.isNotBlank(detail.getExtMsgId())) {
                noSendMsgIdSet.add(detail.getExtMsgId());
            } else {
                result.add(detail);
            }
        }

        //空代表全部发送，不用做后续处理，直接返回
        if (ListUtils.isEmpty(noSendMsgIdSet)) {
            return templateDetails;
        }

        noSendMsgIdSet.forEach(msgId -> {

            //拿到所有发送人
            List<WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo> groupMsgTask = null;
            try {
                groupMsgTask = msgTemplateService.getGroupMsgTask(corpId, msgId, null, 2);
            } catch (WxErrorException e) {
                log.error("微信群群发，获取发送详情异常：", e);
                throw BaseException.buildBaseException(e.getError(), "获取发送详情异常");
            }

            //未发送的，查不出详情的
            if (groupMsgTask.size() == 0 || WxMsgSendStatusEnum.STATUS_NO_SEND.getCode().equals(groupMsgTask.get(0).getStatus())) {
                result.addAll(templateDetails.stream().filter(e -> msgId.equals(e.getExtMsgId())).collect(Collectors.toList()));
            } else {
                //删掉这个msgId的
                detailService.remove(new QueryWrapper<WxMsgGroupTemplateDetail>().lambda()
                        .eq(WxMsgGroupTemplateDetail::getExtCorpId, corpId)
                        .eq(WxMsgGroupTemplateDetail::getMsgTemplateId, id)
                        .eq(WxMsgGroupTemplateDetail::getExtMsgId, msgId));

                for (WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo msg : groupMsgTask) {

                    List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> sendResult = null;
                    try {
                        sendResult = msgTemplateService.getGroupMsgSendResult(corpId, msgId, msg.getUserId(), null);
                    } catch (WxErrorException e) {
                        log.error("微信群群发，获取发送详情异常：", e);
                        throw BaseException.buildBaseException(e.getError(), "获取发送详情异常");
                    }

                    sendResult.forEach(send -> {

                        WxMsgGroupTemplateDetail wxMsgTemplateDetail = new WxMsgGroupTemplateDetail()
                                .setId(UUID.get32UUID())
                                .setExtCorpId(corpId)
                                .setMsgTemplateId(id)
                                .setExtStaffId(msg.getUserId())
                                .setExtChatId(send.getChatId())
                                .setSendStatus(send.getStatus())
                                .setSendTime(new Date(send.getSendTime() * 1000))
                                .setExtMsgId(msgId)
                                .setCreatedAt(new Date())
                                .setUpdatedAt(new Date());

                        result.add(wxMsgTemplateDetail);
                        detailService.save(wxMsgTemplateDetail);
                    });
                }
            }
        });

        return result;
    }


    @Override
    public WxMsgGroupTemplate checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxMsgGroupTemplate byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户群聊-群发消息不存在");
        }
        if (!WxMsgTemplate.STATUS_NO_CREATE.equals(byId.getStatus())) {
            throw new BaseException("该任务不允许修改！");
        }
        return byId;
    }

    @Override
    public WxMsgGroupTemplate cancel(String id) {

        //校验参数
        WxMsgGroupTemplate wxMsgTemplate = checkExists(id);

        wxMsgTemplate.setStatus(WxMsgTemplate.STATUS_CANCEL);

        updateById(wxMsgTemplate);

        return wxMsgTemplate;

    }

    @Override
    public IPage<StaffVO> pageChatOwnerList(StaffPageDTO dto) {

        //查全部群聊
        List<WxGroupChat> groupChatList = chatService.list(new QueryWrapper<WxGroupChat>().lambda()
                .eq(WxGroupChat::getExtCorpId, dto.getExtCorpId()));

        if (ListUtils.isEmpty(groupChatList)) {
            return new Page<>();
        }

        //查群主
        Set<String> ownerSet = groupChatList.stream().map(WxGroupChat::getOwner).collect(Collectors.toSet());

        //查群主信息
        Page<Staff> page = staffService.page(new Page<>(dto.getPageNum(), dto.getPageSize()), new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, dto.getExtCorpId())
                .in(Staff::getExtId, ownerSet));


        return page.convert(staffService::translation);
    }

    @Override
    public void remind(WxMsgTemplateRemindDTO dto) {

        //未发送的详情状态
        List<Integer> noSendStatus = new ArrayList<>();
        noSendStatus.add(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode());
        noSendStatus.add(WxMsgSendStatusEnum.STATUS_OTHER_SEND.getCode());

        //查询
        LambdaQueryWrapper<WxMsgGroupTemplateDetail> queryWrapper = new QueryWrapper<WxMsgGroupTemplateDetail>().lambda()
                .eq(WxMsgGroupTemplateDetail::getExtCorpId, dto.getExtCorpId())
                .eq(WxMsgGroupTemplateDetail::getMsgTemplateId, dto.getTemplateId())
                .in(WxMsgGroupTemplateDetail::getSendStatus, noSendStatus)
                .eq(StringUtils.isNotBlank(dto.getStaffExtId()), WxMsgGroupTemplateDetail::getExtStaffId, dto.getStaffExtId());

        List<WxMsgGroupTemplateDetail> details = detailService.list(queryWrapper);

        if (ListUtils.isEmpty(details)) {
            throw new BaseException("没有需要提醒的员工！");
        }

        //发送应用消息
        Set<String> staffIds = details.stream().map(WxMsgGroupTemplateDetail::getExtStaffId).collect(Collectors.toSet());

        //获取发送内容
        WxMsgGroupTemplate wxMsgTemplate = getById(dto.getTemplateId());

        String content = String.format(REMAIN_TIPS,
                new SimpleDateFormat("YYYY-MM-dd HH:mm").format(wxMsgTemplate.getSendTime()));

        WxMsgUtils.sendMessage(dto.getExtCorpId(), content, staffIds);

    }

    @Override
    public IPage<MsgGroupChatDTO> getChatDetails(MsgGroupChatSearchDTO dto) {

        LambdaQueryWrapper<WxMsgGroupTemplateDetail> queryWrapper = getChatDetailsQuery(dto);

        if (queryWrapper == null) {
            return new Page<>();
        }

        Page<WxMsgGroupTemplateDetail> details = detailService.page(new Page<>(dto.getPageNum(), dto.getPageSize()), queryWrapper);

        return details.convert(e -> translationChatDetail(e, true));
    }

    private LambdaQueryWrapper<WxMsgGroupTemplateDetail> getChatDetailsQuery(MsgGroupChatSearchDTO dto) {
        //群聊名模糊查询条件
        List<String> extChatIds = new ArrayList<>();

        if (StringUtils.isNotBlank(dto.getChatName())) {

            List<WxGroupChat> chatList = chatService.list(new QueryWrapper<WxGroupChat>().lambda()
                    .eq(WxGroupChat::getExtCorpId, dto.getExtCorpId())
                    .like(WxGroupChat::getName, dto.getChatName()));

            if (ListUtils.isEmpty(chatList)) {
                return null;
            }

            extChatIds = chatList.stream().map(WxGroupChat::getExtChatId).collect(Collectors.toList());
        }

        //查出详情
        return new QueryWrapper<WxMsgGroupTemplateDetail>().lambda()
                .eq(WxMsgGroupTemplateDetail::getExtCorpId, dto.getExtCorpId())
                .eq(WxMsgGroupTemplateDetail::getMsgTemplateId, dto.getTemplateId())
                .in(ListUtils.isNotEmpty(extChatIds), WxMsgGroupTemplateDetail::getExtChatId, extChatIds)
                .in(StringUtils.isNotBlank(dto.getOwnerExtId()), WxMsgGroupTemplateDetail::getExtStaffId, dto.getOwnerExtId())
                .eq(dto.getStatus() != null && !dto.getStatus().equals(WxMsgSendStatusEnum.STATUS_EXCEPTION.getCode()), WxMsgGroupTemplateDetail::getSendStatus, dto.getStatus())
                .in(dto.getStatus() != null && dto.getStatus().equals(WxMsgSendStatusEnum.STATUS_EXCEPTION.getCode()), WxMsgGroupTemplateDetail::getSendStatus, WxMsgSendStatusEnum.getFailStatusList());
    }

    @Override
    public void updateData(IdVO dto) {
        updateDetail(dto.getExtCorpId(), dto.getId());
    }

    @Override
    public IPage<MsgGroupStaffDTO> getStaffDetails(MsgGroupStaffSearchDTO dto) {

        //构造查询参数
        LambdaQueryWrapper<WxMsgGroupTemplateDetail> queryWrapper = buildStaffQuery(dto);

        if (queryWrapper == null) {
            return new Page<>();
        }

        //查询
        List<WxMsgGroupTemplateDetail> templateDetails = detailService.list(queryWrapper);

        if (ListUtils.isEmpty(templateDetails)) {
            return new Page<>();
        }

        List<MsgGroupStaffDTO> result = translationStaffDetail(dto.getExtCorpId(), templateDetails);

        result.sort(Comparator.comparing(o -> o.getOwnerInfo().getName()));
        return PageUtils.page(dto.getPageNum(), dto.getPageSize(), result);
    }

    /**
     * 构造群主发送详情的查询条件
     *
     * @param dto
     * @return
     */
    private LambdaQueryWrapper<WxMsgGroupTemplateDetail> buildStaffQuery(MsgGroupStaffSearchDTO dto) {
        //只要有一个群发送成功，都算已发送

        Set<String> sendStaffIdList = null;
        //发送状态查询条件
        if (dto.getHasSend() != null) {

            //查出发送成功的全部msgId
            List<WxMsgGroupTemplateDetail> sendDetails = detailService.list(new QueryWrapper<WxMsgGroupTemplateDetail>().lambda()
                    .eq(WxMsgGroupTemplateDetail::getExtCorpId, dto.getExtCorpId())
                    .eq(WxMsgGroupTemplateDetail::getMsgTemplateId, dto.getTemplateId())
                    .eq(WxMsgGroupTemplateDetail::getSendStatus, WxMsgSendStatusEnum.STATUS_SEND.getCode()));

            sendStaffIdList = sendDetails.stream().map(WxMsgGroupTemplateDetail::getExtStaffId).collect(Collectors.toSet());

            //查已发送的，又没有发送成功的，直接返回空
            if (dto.getHasSend() != null && dto.getHasSend() && ListUtils.isEmpty(sendStaffIdList)) {
                return null;
            }
        }

        //构造查询条件
        return new QueryWrapper<WxMsgGroupTemplateDetail>().lambda()
                .eq(WxMsgGroupTemplateDetail::getExtCorpId, dto.getExtCorpId())
                .eq(WxMsgGroupTemplateDetail::getMsgTemplateId, dto.getTemplateId())
                .in(StringUtils.isNotBlank(dto.getOwnerExtId()), WxMsgGroupTemplateDetail::getExtStaffId, dto.getOwnerExtId())
                .in(dto.getHasSend() != null && dto.getHasSend(), WxMsgGroupTemplateDetail::getExtStaffId, sendStaffIdList)
                .notIn(dto.getHasSend() != null && !dto.getHasSend() && ListUtils.isNotEmpty(sendStaffIdList),
                        WxMsgGroupTemplateDetail::getExtStaffId, sendStaffIdList);
    }

    @Override
    public void exportChatDetails(MsgGroupChatSearchDTO dto, HttpServletRequest request, HttpServletResponse response) {

        LambdaQueryWrapper<WxMsgGroupTemplateDetail> queryWrapper = getChatDetailsQuery(dto);

        //获取标题
        String title = getExportTitle(dto.getTemplateId(), "客户群接受详情");

        if (queryWrapper == null) {
            EasyPoiUtils.export("客户群群发-客户群接受详情", title, null,
                    MsgGroupChatExportDTO.class, new ArrayList<>(), response, request);
        }

        //查询全部
        List<WxMsgGroupTemplateDetail> details = detailService.list(queryWrapper);

        //像查询接口那样翻译
        List<MsgGroupChatDTO> msgGroupChatDTOS = details.stream().map(e -> translationChatDetail(e, true)).collect(Collectors.toList());

        //翻译成导出的数据
        List<MsgGroupChatExportDTO> exportData = msgGroupChatDTOS.stream().map(this::translationChatExport).collect(Collectors.toList());

        EasyPoiUtils.export("客户群群发-客户群接受详情", title, null,
                MsgGroupChatExportDTO.class, exportData);
    }

    @Override
    public void exportStaffDetails(MsgGroupStaffSearchDTO dto, HttpServletRequest request, HttpServletResponse response) {

        //构造查询参数
        LambdaQueryWrapper<WxMsgGroupTemplateDetail> queryWrapper = buildStaffQuery(dto);

        //获取标题
        String title = getExportTitle(dto.getTemplateId(), "群主发送详情");

        if (queryWrapper == null) {
            EasyPoiUtils.export("客户群群发-群主发送详情", title, null,
                    MsgGroupStaffExportDTO.class, new ArrayList<>(), response, request);
        }

        //查询
        List<WxMsgGroupTemplateDetail> templateDetails = detailService.list(queryWrapper);

        //数据处理
        List<MsgGroupStaffDTO> data = translationStaffDetail(dto.getExtCorpId(), templateDetails);

//        转发群主发送详情的查询数据成导出的
        List<MsgGroupStaffExportDTO> exportData = data.stream().map(this::translationStaffExport).collect(Collectors.toList());

        EasyPoiUtils.export("客户群群发-群主发送详情", title, null,
                MsgGroupStaffExportDTO.class, exportData);
    }

    @Override
    public void scanMsgGroupTemplate() {
        List<WxMsgGroupTemplate> list = list(new QueryWrapper<WxMsgGroupTemplate>().lambda()
                .eq(WxMsgGroupTemplate::getStatus, WxMsgSendStatusEnum.STATUS_NO_SEND.getCode())
                .le(WxMsgGroupTemplate::getSendTime, new Date()));

        if (list.isEmpty()) {
            return;
        }

        list.forEach(e -> {

            List<WxMsgGroupTemplateDetail> details = detailService.list(new QueryWrapper<WxMsgGroupTemplateDetail>().lambda()
                    .eq(WxMsgGroupTemplateDetail::getMsgTemplateId, e.getId()));

            createSendMsgTask(e, details);

            e.setStatus(WxMsgTemplate.STATUS_WAIT);

            updateById(e);

            detailService.updateBatchById(details);
        });
    }

    @Override
    public WxMsgGroupTemplate savePerson(WxPersonTemplateSaveDTO dto) throws WxErrorException {

        //找五分钟内的个人群发，创建者是这个人
        List<WxCpGroupMsgListResult.ExternalContactGroupMsgInfo> msgList = msgTemplateService.getGroupMsgList(dto.getExtCorpId(), "group", DateUtils.operationDate(Calendar.MINUTE, -5), new Date(), JwtUtil.getExtUserId(), 2, null);

        if (msgList.stream().noneMatch(e -> e.getText().equals(WxMsgUtils.changeToText(dto.getMsg(), null)))) {
            log.error("找不到该创建者对应的群发记录，[{}], [{}], [{}], [{}], [{}]", dto.getExtCorpId(), DateUtils.operationDate(Calendar.MINUTE, -5), new Date(), JwtUtil.getExtUserId(), JSON.toJSONString(msgList));
            throw new BaseException("找不到该创建者对应的群发记录");
        }

        WxCpGroupMsgListResult.ExternalContactGroupMsgInfo msgInfo = msgList.stream().filter(e -> e.getText().equals(WxMsgUtils.changeToText(dto.getMsg(), null)))
                .max(Comparator.comparing(WxCpGroupMsgListResult.ExternalContactGroupMsgInfo::getCreateTime)).get();

        //拿到所有发送人
        List<WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo> groupMsgTask = msgTemplateService.getGroupMsgTask(dto.getExtCorpId(), msgInfo.getMsgId(), null, 2);

        //封装数据
        String jobId = UUID.get32UUID();
        List<WxMsgGroupTemplateDetail> detailList = new ArrayList<>();

        for (WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo msg : groupMsgTask) {

            List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> sendResult = msgTemplateService.getGroupMsgSendResult(dto.getExtCorpId(), msgInfo.getMsgId(), msg.getUserId(), null);

            sendResult.forEach(send -> {

                Date sendTime = send.getSendTime() == null ? null : new Date(send.getSendTime() * 1000);

                WxMsgGroupTemplateDetail wxMsgTemplateDetail = new WxMsgGroupTemplateDetail()
                        .setId(UUID.get32UUID())
                        .setExtCorpId(dto.getExtCorpId())
                        .setMsgTemplateId(jobId)
                        .setExtStaffId(msg.getUserId())
                        .setExtChatId(send.getChatId())
                        .setSendStatus(send.getStatus())
                        .setSendTime(sendTime)
                        .setExtMsgId(msgInfo.getMsgId())
                        .setCreatedAt(new Date())
                        .setUpdatedAt(new Date());
                detailList.add(wxMsgTemplateDetail);
            });
        }

        List<String> staffIds = detailList.stream().map(WxMsgGroupTemplateDetail::getExtStaffId).distinct().collect(Collectors.toList());

        WxMsgGroupTemplate wxMsgGroupTemplate = new WxMsgGroupTemplate()
                .setId(jobId)
                .setExtCorpId(dto.getExtCorpId())
                .setCreatorExtId(JwtUtil.getExtUserId())
                .setName(dto.getName())
                .setHasPerson(true)
                .setHasSchedule(false)
                .setSendTime(new Date())
                .setMsg(dto.getMsg())
                .setHasAllStaff(false)
                .setExtStaffIds(staffIds)
                .setStatus(WxMsgTemplate.STATUS_WAIT)
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date());

        save(wxMsgGroupTemplate);
        detailService.saveBatch(detailList);
        return wxMsgGroupTemplate;
    }

    @Override
    public void deleteById(String id) {
        removeById(id);
        detailService.remove(new QueryWrapper<WxMsgGroupTemplateDetail>().lambda().eq(WxMsgGroupTemplateDetail::getMsgTemplateId, id));
    }

    /**
     * 转发群主发送详情的查询数据成导出的
     *
     * @param msgGroupStaffDTO
     * @return
     */
    private MsgGroupStaffExportDTO translationStaffExport(MsgGroupStaffDTO msgGroupStaffDTO) {
        MsgGroupStaffExportDTO result = new MsgGroupStaffExportDTO();
        BeanUtils.copyProperties(msgGroupStaffDTO, result);

//        result.setOwnerCN("$userName=" + msgGroupStaffDTO.getOwnerInfo().getName() + "$");
//        result.setOwnerDeptCN("$departmentName=" + msgGroupStaffDTO.getOwnerInfo().getDeptCN().replace("[", "").replace("]", "") + "$");

        if (msgGroupStaffDTO.getSendStatus() != null && msgGroupStaffDTO.getSendStatus()) {
            result.setStatusCN("已发送");
        } else {
            result.setStatusCN("未发送");
        }

        return result;
    }

    /**
     * 把群聊信息翻译成导出的
     *
     * @param msgGroupChatDTO
     * @return
     */
    private MsgGroupChatExportDTO translationChatExport(MsgGroupChatDTO msgGroupChatDTO) {

        MsgGroupChatExportDTO result = new MsgGroupChatExportDTO();
        BeanUtils.copyProperties(msgGroupChatDTO, result);

//        result.setOwnerCN("$userName=" + msgGroupChatDTO.getOwnerInfo().getName() + "$");
//        result.setOwnerDeptCN("$departmentName=" + msgGroupChatDTO.getOwnerInfo().getDeptCN().replace("[", "").replace("]", "") + "$");

        if (WxMsgSendStatusEnum.STATUS_NO_SEND.getCode().equals(msgGroupChatDTO.getSendStatus())) {
            result.setStatusCN("群主未发送");
        } else if (WxMsgSendStatusEnum.STATUS_SEND.getCode().equals(msgGroupChatDTO.getSendStatus())) {
            result.setStatusCN("群主已发送");
        } else {
            result.setStatusCN("群主发送失败");
        }
        return result;
    }

    private String getExportTitle(String templateId, String flag) {

        WxMsgGroupTemplate wxMsgTemplate = getById(templateId);

        SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd HH:mm");

        return String.format("%s——%s（导出时间：%s）",
                wxMsgTemplate.getName(), flag, sdf.format(new Date()));
    }

    /**
     * 转化查询的群主信息
     *
     * @param templateDetails
     * @return
     */
    private List<MsgGroupStaffDTO> translationStaffDetail(String corpId, List<WxMsgGroupTemplateDetail> templateDetails) {
        //处理查询结果, 把详情按员工分组
        Map<String, List<WxMsgGroupTemplateDetail>> staffDetailMap = templateDetails.stream().collect(Collectors.groupingBy(WxMsgGroupTemplateDetail::getExtStaffId));

        List<MsgGroupStaffDTO> result = new ArrayList<>(staffDetailMap.size());

        staffDetailMap.forEach((staffId, details) -> {

            MsgGroupStaffDTO staffDTO = new MsgGroupStaffDTO();
            staffDTO.setOwnerInfo(staffService.getSimpleInfo(corpId,
                    null, staffId));
            staffDTO.setChatInfo(details.stream().map(e -> translationChatDetail(e, false)).collect(Collectors.toList()));
            staffDTO.setTotal(staffDTO.getChatInfo().size());
            for (MsgGroupChatDTO msgGroupChatDTO : staffDTO.getChatInfo()) {

                if (msgGroupChatDTO.getSendStatus().equals(WxMsgSendStatusEnum.STATUS_SEND.getCode())) {
                    staffDTO.setSendCount(staffDTO.getSendCount() + 1);
                } else {
                    staffDTO.setNoSendCount(staffDTO.getNoSendCount() + 1);
                }

            }
            //一个发送成功就是发送成功
            staffDTO.setSendStatus(staffDTO.getSendCount() > 0);
            staffDTO.setSendTime(details.get(0).getSendTime());

            result.add(staffDTO);
        });

        return result;
    }

    /**
     * 翻译微信群详情
     *
     * @param detail
     * @return
     */
    private MsgGroupChatDTO translationChatDetail(WxMsgGroupTemplateDetail detail, boolean translateStaff) {
        MsgGroupChatDTO result = new MsgGroupChatDTO();
        //群消息
        WxGroupChat chat = chatService.getOne(new QueryWrapper<WxGroupChat>().lambda()
                .eq(WxGroupChat::getExtCorpId, detail.getExtCorpId())
                .eq(WxGroupChat::getExtChatId, detail.getExtChatId()));

        BeanUtils.copyProperties(chat, result);

        //状态
        if (WxMsgSendStatusEnum.isInFailStatus(detail.getSendStatus())) {
            result.setSendStatus(WxMsgSendStatusEnum.STATUS_EXCEPTION.getCode());
        } else {
            result.setSendStatus(detail.getSendStatus());
        }

        //获取员工信息
        if (translateStaff) {
            result.setOwnerInfo(staffService.getSimpleInfo(detail.getExtCorpId(),
                    null, detail.getExtStaffId()));
        }
        return result;
    }
}
