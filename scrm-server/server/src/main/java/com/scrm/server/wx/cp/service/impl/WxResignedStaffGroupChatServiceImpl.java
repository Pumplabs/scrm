package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.entity.WxGroupChatTransferInfo;
import com.scrm.api.wx.cp.vo.StaffTransferGroupChatInfoVO;
import com.scrm.api.wx.cp.vo.StaffTransferGroupChatVO;
import com.scrm.api.wx.cp.vo.WxGroupChatTransferInfoVO;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import com.scrm.server.wx.cp.service.IWxGroupChatTransferInfoService;
import com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatPageDTO;
import com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatStatisticsVO;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.WxResignedStaffGroupChat;
import com.scrm.server.wx.cp.mapper.WxResignedStaffGroupChatMapper;
import com.scrm.server.wx.cp.service.IWxResignedStaffGroupChatService;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalGroupChatList;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalGroupChatTransferResp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.*;

import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

import java.util.stream.Collectors;

/**
 * 离职员工-群聊关联 服务实现类
 *
 * @author xxh
 * @since 2022-06-27
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxResignedStaffGroupChatServiceImpl extends ServiceImpl<WxResignedStaffGroupChatMapper, WxResignedStaffGroupChat> implements IWxResignedStaffGroupChatService {

    @Autowired
    private IWxGroupChatService groupChatService;

    @Autowired
    private IWxGroupChatTransferInfoService groupChatTransferInfoService;

    @Autowired
    private IStaffService staffService;


    @Override
    public IPage<WxResignedStaffGroupChatStatisticsVO> pageList(WxResignedStaffGroupChatPageDTO dto) {
        IPage<WxResignedStaffGroupChatStatisticsVO> page = baseMapper.pageList(new Page<>(dto.getPageNum(), dto.getPageSize()), dto);
        Optional.ofNullable(page.getRecords()).orElse(new ArrayList<>()).forEach(vo ->
            vo.setHandoverStaff(staffService.translation(staffService.find(dto.getExtCorpId(), vo.getHandoverStaffExtId()))));
        return page;
    }



    /**
     * 翻译
     *
     * @param wxResignedStaffGroupChat 实体
     * @return WxResignedStaffGroupChatVO 结果集
     * @author xxh
     * @date 2022-06-27
     */
    private WxResignedStaffGroupChatVO translation(WxResignedStaffGroupChat wxResignedStaffGroupChat) {
        WxResignedStaffGroupChatVO vo = new WxResignedStaffGroupChatVO();
        BeanUtils.copyProperties(wxResignedStaffGroupChat, vo);
        vo.setHandoverStaff(staffService.translation(staffService.find(wxResignedStaffGroupChat.getExtCorpId(), wxResignedStaffGroupChat.getHandoverStaffExtId())))
                .setGroupChat(groupChatService.translation(groupChatService.find(wxResignedStaffGroupChat.getExtCorpId(), wxResignedStaffGroupChat.getGroupChatExtId())));
        return vo;
    }

    @Override
    public void sync(String extCorpId) throws WxErrorException {
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        //删除旧的数据
        remove(new LambdaQueryWrapper<WxResignedStaffGroupChat>().eq(WxResignedStaffGroupChat::getExtCorpId, extCorpId));

        List<WxResignedStaffGroupChat> list = new ArrayList<>();
        //0 - 所有列表(即不过滤)
        //1 - 离职待继承
        //2 - 离职继承中
        //3 - 离职继承完成
        List<WxCpUserExternalGroupChatList.ChatStatus> chatStatuses = listGroupChat(externalContactService, null, new ArrayList<>(), 1);
        Optional.ofNullable(chatStatuses).orElse(new ArrayList<>()).forEach(chatStatus -> {
            WxResignedStaffGroupChat wxResignedStaffGroupChat = new WxResignedStaffGroupChat().setId(UUID.get32UUID())
                    .setExtCorpId(extCorpId)
                    .setCreateTime(new Date())
                    .setCreator(JwtUtil.getUserId())
                    .setGroupChatExtId(chatStatus.getChatId());
            //从数据库里查原群主
            WxGroupChat groupChat = groupChatService.find(extCorpId, chatStatus.getChatId());
            if (groupChat != null) {
                wxResignedStaffGroupChat.setHandoverStaffExtId(groupChat.getOwner())
                        .setHandoverStaffName(groupChat.getOwnerName());
                list.add(wxResignedStaffGroupChat);
            }

        });

        saveBatch(list);
    }

    @Override
    public StaffTransferGroupChatVO transferGroupChat(WxStaffResignedTransferGroupChatDTO dto) {

        //继承给的新群主，必须是配置了客户联系功能的成员
        //继承给的新群主，必须有设置实名
        //继承给的新群主，必须有激活企业微信
        //同一个人的群，限制每天最多分配300个给新群主
        StaffTransferGroupChatVO vo = new StaffTransferGroupChatVO();

        //校验参数
        Staff takeoverStaff = staffService.checkExists(dto.getTakeoverStaffExtId(),dto.getExtCorpId());
        if (takeoverStaff.getStatus() != 1) {
            throw new BaseException("继承给的新群主，必须有激活企业微信");
        }
        List<WxGroupChat> groupChatList = dto.getGroupChatExtIds().stream().map(extId -> groupChatService.find(dto.getExtCorpId(), extId)).collect(Collectors.toList());
        if (ListUtils.isEmpty(groupChatList) || groupChatList.size() != dto.getGroupChatExtIds().size()) {
            throw new BaseException("客户群聊不存在");
        }

        Map<String, Integer> ownerAndNumMap = new HashMap<>();
        groupChatList.forEach(groupChat -> {
            Integer num = Optional.ofNullable(ownerAndNumMap.get(groupChat.getOwner())).orElse(0);
            num++;
            ownerAndNumMap.put(groupChat.getOwner(), num);
        });

        //同一个人的群，限制每天最多分配300个给新群主
        List<String> ownerExtIds = groupChatList.stream().map(WxGroupChat::getOwner).distinct().collect(Collectors.toList());
        ownerExtIds.forEach(ownerExtId -> {
            int count = (int) groupChatTransferInfoService.count(new LambdaQueryWrapper<WxGroupChatTransferInfo>()
                    .eq(WxGroupChatTransferInfo::getHandoverStaffExtId, ownerExtId)
                    .ge(WxGroupChatTransferInfo::getCreateTime, DateUtils.getTodayDate())
                    .lt(WxGroupChatTransferInfo::getCreateTime, DateUtils.getTomorrowDate()));
            int total = count + Optional.ofNullable(ownerAndNumMap.get(ownerExtId)).orElse(0);
            if (total > 300) {
                Staff staff = staffService.checkExists(ownerExtId, dto.getExtCorpId());
                throw new BaseException("同一个人的群，限制每天最多分配300个给新群主，员工:'【%s】',今天已分配%s个群，还能分配%个群.", staff.getName(), count, 300 - count);
            }
        });

        //转移群聊列表
        List<StaffTransferGroupChatInfoVO> infoVOS = new ArrayList<>();
        List<List<String>> partitionList = ListUtils.partition(dto.getGroupChatExtIds(), 100);
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        partitionList.forEach(groupChaExtIds -> {
            if (ListUtils.isEmpty(groupChaExtIds)) {
                return;
            }

            List<WxGroupChat> groupChats = groupChatList.stream().filter(groupChat -> groupChaExtIds.contains(groupChat.getExtChatId())).collect(Collectors.toList());
            try {
                //调用企业微信接口：分配离职成员的群聊
                WxCpUserExternalGroupChatTransferResp resp = externalContactService.transferGroupChat(groupChaExtIds.toArray(new String[0]), dto.getTakeoverStaffExtId());
                Map<String, WxCpUserExternalGroupChatTransferResp.GroupChatFailedTransfer> extIdAndErrorMap = Optional.ofNullable(resp.getFailedChatList()).orElse(new ArrayList<>()).stream().collect(Collectors.toMap(WxCpUserExternalGroupChatTransferResp.GroupChatFailedTransfer::getChatId, o -> o));
                groupChats.forEach(groupChat -> {
                    WxCpUserExternalGroupChatTransferResp.GroupChatFailedTransfer groupChatFailedTransfer = extIdAndErrorMap.get(groupChat.getExtChatId());
                    StaffTransferGroupChatInfoVO infoVO = new StaffTransferGroupChatInfoVO().setGroupChatName(groupChat.getName())
                            .setGroupChatExtId(groupChat.getExtChatId());
                    if (groupChatFailedTransfer == null) {
                        WxGroupChatTransferInfo wxGroupChatTransferInfo = new WxGroupChatTransferInfo()
                                .setId(UUID.get32UUID())
                                .setCreateTime(new Date())
                                .setExtCorpId(dto.getExtCorpId())
                                .setGroupChatExtId(groupChat.getExtChatId())
                                .setHandoverStaffExtId(groupChat.getOwner())
                                .setTakeoverStaffExtId(dto.getTakeoverStaffExtId());
                        groupChatTransferInfoService.save(wxGroupChatTransferInfo);
                        infoVO.setErrCode(0);
                    } else {
                        infoVO.setErrCode(groupChatFailedTransfer.getErrcode()).setErrMsg(groupChatFailedTransfer.getErrmsg());
                    }
                    infoVOS.add(infoVO);
                });
            } catch (WxErrorException e) {
                infoVOS.addAll(groupChats.stream().map(groupChat -> new StaffTransferGroupChatInfoVO()
                        .setGroupChatName(groupChat.getName())
                        .setGroupChatExtId(groupChat.getId())
                        .setErrMsg(e.getError().getErrorMsgEn())
                        .setErrCode(e.getError().getErrorCode())).collect(Collectors.toList()));
                log.error("调用企业微信接口异常，请求参数：【{},{}】，异常信息：【{}】", Arrays.toString(groupChaExtIds.toArray(new String[0])) + dto.getTakeoverStaffExtId(), e.getError().toString(), e);
            }
        });

        List<StaffTransferGroupChatInfoVO> succeedList = Optional.of(infoVOS).orElse(new ArrayList<>()).stream().filter(infoVO -> infoVO.getErrCode() == 0).collect(Collectors.toList());


        //刷新移交群聊数据,修改群聊移交信息
        List<String> groupChatExtIds = succeedList.stream().map(StaffTransferGroupChatInfoVO::getGroupChatExtId).collect(Collectors.toList());
        if (ListUtils.isNotEmpty(groupChatExtIds)) {
           /* Optional.of(groupChatIds).orElse(new ArrayList<>()).forEach(groupChatId -> {
                try {
                    groupChatService.sync(dto.getExtCorpId(), groupChatId);
                } catch (WxErrorException e) {
                    e.printStackTrace();
                    throw new BaseException(e.getError().getErrorCode(), e.getError().getErrorMsg());
                }
            });*/
            remove(new LambdaUpdateWrapper<WxResignedStaffGroupChat>()
                    .eq(WxResignedStaffGroupChat::getExtCorpId, dto.getExtCorpId())
                    .in(WxResignedStaffGroupChat::getGroupChatExtId, groupChatExtIds));
        }


        return vo.setSucceedList(succeedList).setFailList(Optional.of(infoVOS).orElse(new ArrayList<>()).stream().filter(infoVO -> infoVO.getErrCode() != 0).collect(Collectors.toList())).setSucceedTotal(vo.getSucceedList().size()).setFailTotal(vo.getFailList().size());
    }

    @Override
    public IPage<WxResignedStaffGroupChatVO> waitTransferPageList(WxResignedStaffGroupChatWaitPageDTO dto) {
        LambdaQueryWrapper<WxResignedStaffGroupChat> wrapper = new LambdaQueryWrapper<WxResignedStaffGroupChat>()
                .eq(WxResignedStaffGroupChat::getExtCorpId, dto.getExtCorpId())
                .eq(WxResignedStaffGroupChat::getHandoverStaffExtId, dto.getHandoverStaffExtId())
                .orderByDesc(WxResignedStaffGroupChat::getCreateTime);
        IPage<WxResignedStaffGroupChat> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }

    @Override
    public IPage<WxGroupChatTransferInfoVO> transferPageInfo(WxGroupChatTransferInfoPageDTO dto) {
        return groupChatTransferInfoService.pageList(dto);
    }


    private List<WxCpUserExternalGroupChatList.ChatStatus> listGroupChat(WxCpExternalContactService externalContactService, String cursor, List<WxCpUserExternalGroupChatList.ChatStatus> groupChatList, Integer statusFilter) throws WxErrorException {
        groupChatList = Optional.ofNullable(groupChatList).orElse(new ArrayList<>());
        WxCpUserExternalGroupChatList wxCpUserExternalGroupChatList = externalContactService.listGroupChat(1000, cursor, statusFilter, null);
        List<WxCpUserExternalGroupChatList.ChatStatus> groupChats = wxCpUserExternalGroupChatList.getGroupChatList();
        if (ListUtils.isNotEmpty(groupChats)) {
            groupChatList.addAll(groupChats);
        }
        if (StringUtils.isNotBlank(wxCpUserExternalGroupChatList.getNextCursor())) {
            listGroupChat(externalContactService, wxCpUserExternalGroupChatList.getNextCursor(), groupChatList, statusFilter);
        }
        return groupChatList;
    }
}

