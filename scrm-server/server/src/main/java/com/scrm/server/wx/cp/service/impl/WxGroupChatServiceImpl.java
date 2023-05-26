package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.*;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicModelEnum;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicTypeEnum;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.common.exception.BaseException;
import com.scrm.common.exception.WxErrorEnum;
import com.scrm.common.util.*;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.dto.WxGroupChatStatisticsInfoExportDTO;
import com.scrm.server.wx.cp.mapper.WxGroupChatMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxTranslateExportUtils;
import com.scrm.server.wx.cp.vo.WxGroupChatStatisticsInfoExportVO;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalGroupChatInfo;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalGroupChatList;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalGroupChatStatistic;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

/**
 * 客户群 服务实现类
 *
 * @author xxh
 * @since 2022-01-19
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxGroupChatServiceImpl extends ServiceImpl<WxGroupChatMapper, WxGroupChat> implements IWxGroupChatService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IDepartmentService departmentService;

    @Autowired
    private IWxGroupChatMemberService groupChatMemberService;

    @Autowired
    private IWxGroupChatStatisticsService groupChatStatisticsService;

    @Autowired
    private IWxGroupChatTagService groupChatTagService;

    @Autowired
    private IWxGroupChatTagMapService groupChatTagMapService;

    @Autowired
    private IWxGroupChatTransferInfoService groupChatTransferInfoService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;


    @Autowired
    private IBrCustomerDynamicService customerDynamicService;

    @Autowired
    private ISysRoleStaffService roleStaffService;


    @Override
    public IPage<WxGroupChatVO> pageList(WxGroupChatPageDTO dto) {

        //根据名称筛选群主
        if (StringUtils.isNotBlank(dto.getOwnerName())) {
            List<String> extIds = Optional.ofNullable(
                    staffService.list(new LambdaQueryWrapper<Staff>()
                            .select(Staff::getExtId)
                            .eq(Staff::getExtCorpId, dto.getExtCorpId())
                            .like(Staff::getName, dto.getOwnerName()))
            ).orElse(new ArrayList<>()).stream().map(Staff::getExtId).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(extIds)) {
                List<String> list = Optional.ofNullable(dto.getOwnerExtIds()).orElse(new ArrayList<>());
                list.addAll(extIds);
                dto.setOwnerExtIds(list);
            }

        }
        dto.setLoginStaffExtId(JwtUtil.getExtUserId()).setIsEnterpriseAdmin(roleStaffService.isEnterpriseAdmin());
        IPage<WxGroupChat> page = baseMapper.pageList(new Page<>(dto.getPageNum(), dto.getPageSize()), dto);
        return page.convert(this::translation);
    }


    @Override
    public WxGroupChatVO findById(String id) {
        return translation(checkExists(id));
    }


    /**
     * 翻译
     *
     * @param wxGroupChat 实体
     * @return WxGroupChatVO 结果集
     * @author xxh
     * @date 2022-01-19
     */
    @Override
    public WxGroupChatVO translation(WxGroupChat wxGroupChat) {
        WxGroupChatVO vo = new WxGroupChatVO();
        if (wxGroupChat == null) {
            return vo;
        }
        BeanUtils.copyProperties(wxGroupChat, vo);
        vo.setOwnerInfo(StringUtils.isBlank(wxGroupChat.getOwner()) ? null :
                staffService.translation(staffService.getOne(new LambdaQueryWrapper<Staff>().eq(Staff::getExtCorpId, wxGroupChat.getExtCorpId()).eq(Staff::getExtId, wxGroupChat.getOwner())))
        );

        WxGroupChatStatistics groupChatStatistics = groupChatStatisticsService.getToday(wxGroupChat.getExtCorpId(), wxGroupChat.getExtChatId());
        vo.setTodayJoinMemberNum(Optional.ofNullable(groupChatStatistics.getJoinMemberNum()).orElse(0))
                .setTodayQuitMemberNum(Optional.ofNullable(groupChatStatistics.getQuitMemberNum()).orElse(0));

        List<String> tagIds = Optional.ofNullable(groupChatTagMapService.list(new LambdaQueryWrapper<WxGroupChatTagMap>()
                        .select(WxGroupChatTagMap::getGroupChatTagId)
                        .eq(WxGroupChatTagMap::getGroupChatId, wxGroupChat.getId()))).orElse(new ArrayList<>())
                .stream().map(WxGroupChatTagMap::getGroupChatTagId).collect(Collectors.toList());

        if (ListUtils.isNotEmpty(tagIds)) {
            vo.setTags(groupChatTagService.list(new LambdaQueryWrapper<WxGroupChatTag>()
                    .eq(WxGroupChatTag::getExtCorpId, wxGroupChat.getExtCorpId())
                    .in(WxGroupChatTag::getId, tagIds)
                    .orderByDesc(WxGroupChatTag::getOrder)));
        }

        //查询转移情况
        /*WxGroupChatTransferInfo groupChatTransferInfo = groupChatTransferInfoService.getOne(new LambdaQueryWrapper<WxGroupChatTransferInfo>()
                .eq(WxGroupChatTransferInfo::getExtCorpId, vo.getExtCorpId())
                .eq(WxGroupChatTransferInfo::getOldOwnerId, vo.getId())
                .orderByDesc(WxGroupChatTransferInfo::getCreateTime)
                .last("limit 1")
        );
        vo.setGroupChatTransferInfo(groupChatTransferInfo);*/

        return vo;
    }

    @Override
    public void delete(String extCorpId, String chatExtId) {
        WxGroupChat groupChat = getOne(new LambdaQueryWrapper<WxGroupChat>()
                .eq(WxGroupChat::getExtCorpId, extCorpId)
                .eq(WxGroupChat::getExtChatId, chatExtId)
        );

        if (groupChat == null) {
            return;
        }

        delete(groupChat);
    }

    List<WxGroupChatPullNewStatisticsVO> getPullNewStatistics(String extCorpId, List<String> ownerList, Integer topNum, int day) {
        ownerList = Optional.ofNullable(ownerList).orElse(new ArrayList<>()).stream().distinct().collect(Collectors.toList());
        List<WxGroupChatPullNewStatisticsVO> pullNewStatisticsVOS = new ArrayList<>();
        if (ListUtils.isEmpty(ownerList)) {
            return pullNewStatisticsVOS;
        }
        ownerList = staffService.list(new LambdaQueryWrapper<Staff>().eq(Staff::getExtCorpId, extCorpId).in(Staff::getExtId, ownerList)).stream().map(Staff::getExtId).collect(Collectors.toList());
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        try {
            WxCpUserExternalGroupChatStatistic groupChatStatistic = externalContactService.getGroupChatStatistic(DateUtils.getDate(day), 3, 0, 1, topNum, ownerList.toArray(new String[0]), null);
            List<WxCpUserExternalGroupChatStatistic.StatisticItem> itemList = groupChatStatistic.getItemList();
            Optional.ofNullable(itemList).orElse(new ArrayList<>()).forEach(statisticItem -> {
                int newMemberCnt = statisticItem.getItemData().getNewMemberCnt();
                pullNewStatisticsVOS.add(new WxGroupChatPullNewStatisticsVO().setExtStaffId(statisticItem.getOwner()).setPullNewTotal(newMemberCnt));
            });
        } catch (WxErrorException e) {
            log.error("调用企业微信接口，获取群统计信息失败：{}", e);
            throw new BaseException("获取统计信息失败");
        }
        return pullNewStatisticsVOS;
    }

    @Override
    public WxGroupChatStatisticsResultVO getStatics(WxGroupChatStatisticsDTO dto) {

        long total = count(new LambdaQueryWrapper<WxGroupChat>().eq(WxGroupChat::getExtCorpId, dto.getExtCorpId()).in(WxGroupChat::getStatus, Arrays.asList(WxGroupChat.STATUS_NORMAL, WxGroupChat.STATUS_FINISH)));
        WxGroupChatStatisticsResultVO resultVO = new WxGroupChatStatisticsResultVO().setTodayTotal(total);
        List<WxGroupChatStatisticsVO> last30StatisticsInfos = new ArrayList<>();
        List<WxGroupChatStatisticsVO> last7StatisticsInfos = new ArrayList<>();


        List<String> ownerList = Optional.ofNullable(list(new LambdaQueryWrapper<WxGroupChat>().select(WxGroupChat::getOwner)
                        .eq(WxGroupChat::getExtCorpId, dto.getExtCorpId()))).orElse(new ArrayList<>())
                .stream().map(WxGroupChat::getOwner).filter(StringUtils::isNotBlank).distinct().collect(Collectors.toList());

        List<WxGroupChatPullNewStatisticsVO> last7PullNewStatisticsInfos = baseMapper.getPullNewStatisticsInfos(dto.getExtCorpId(), dto.getTopNum(), DateUtils.getDate(-6).getTime(), DateUtils.getDate(1).getTime());
        List<WxGroupChatPullNewStatisticsVO> last30PullNewStatisticsInfos = baseMapper.getPullNewStatisticsInfos(dto.getExtCorpId(), dto.getTopNum(), DateUtils.getDate(-29).getTime(), DateUtils.getDate(1).getTime());
/*        List<WxGroupChatPullNewStatisticsVO> last7PullNewStatisticsInfos = getPullNewStatistics(dto.getExtCorpId(), ownerList, dto.getTopNum(), );
        List<WxGroupChatPullNewStatisticsVO> last30PullNewStatisticsInfos = getPullNewStatistics(dto.getExtCorpId(), ownerList, dto.getTopNum(), -30);*/


        resultVO.setLast7PullNewStatisticsInfos(Optional.ofNullable(last7PullNewStatisticsInfos).orElse(new ArrayList<>()).stream().filter(info -> info.getPullNewTotal() > 0).collect(Collectors.toList()))
                .setLast30PullNewStatisticsInfos(Optional.ofNullable(last30PullNewStatisticsInfos).orElse(new ArrayList<>()).stream().filter(info -> info.getPullNewTotal() > 0).collect(Collectors.toList()))
                .setLast7StatisticsInfos(last7StatisticsInfos)
                .setLast30StatisticsInfos(last30StatisticsInfos);

        for (int i = 0; i < 30; i++) {
            Date date = DateUtils.getDate(-i);
            List<WxGroupChatStatistics> list = groupChatStatisticsService.list(new LambdaQueryWrapper<WxGroupChatStatistics>()
                    .eq(WxGroupChatStatistics::getExtCorpId, dto.getExtCorpId())
                    .eq(WxGroupChatStatistics::getCreateDate, date));

            final long[] totalMember = {0};
            final long[] customerNum = {0};
            final long[] joinMemberNum = {0};
            final long[] quitMemberNum = {0};
            Optional.ofNullable(list).orElse(new ArrayList<>()).forEach(wxGroupChatStatistics -> {
                totalMember[0] = wxGroupChatStatistics.getTotal() + totalMember[0];
                customerNum[0] = wxGroupChatStatistics.getCustomerNum() + customerNum[0];
                joinMemberNum[0] = wxGroupChatStatistics.getJoinMemberNum() + joinMemberNum[0];
                quitMemberNum[0] = wxGroupChatStatistics.getQuitMemberNum() + quitMemberNum[0];
            });

            WxGroupChatStatisticsVO statisticsInfo = new WxGroupChatStatisticsVO()
                    .setDay(date)
                    .setCustomerNum(customerNum[0])
                    .setJoinMemberNum(joinMemberNum[0])
                    .setQuitMemberNum(quitMemberNum[0])
                    .setTotalMember(totalMember[0]);
            last30StatisticsInfos.add(statisticsInfo);

            if (i < 7) {
                last7StatisticsInfos.add(statisticsInfo);
            }

            if (i == 0) {
                resultVO.setTodayStatisticsInfo(statisticsInfo);
            }

        }
        return resultVO;
    }

    @Override
    public WxGroupChatVO getByExtId(String extCorpId, String extId) {
        WxGroupChat groupChat = getOne(new LambdaQueryWrapper<WxGroupChat>()
                .eq(WxGroupChat::getExtCorpId, extCorpId)
                .eq(WxGroupChat::getExtChatId, extId));
        return translation(groupChat);
    }

    @Override
    public WxGroupChat find(String extCorpId, String extId) {
        return baseMapper.find(extCorpId, extId);
    }

    @Override
    public WxGroupChatTodayStatisticsVO getTodayStatics(String extCorpId, Boolean isPermission) {
        Date date = DateUtils.getDate(0);

        LambdaQueryWrapper<WxGroupChatStatistics> queryWrapper = new LambdaQueryWrapper<WxGroupChatStatistics>()
                .eq(WxGroupChatStatistics::getExtCorpId, extCorpId)
                .eq(WxGroupChatStatistics::getCreateDate, date);
        List<WxGroupChatStatistics> list = new ArrayList<>();
        if (Optional.ofNullable(isPermission).orElse(false) && !roleStaffService.isEnterpriseAdmin()) {
            List<String> chatExtIds = Optional.ofNullable(list(new LambdaQueryWrapper<WxGroupChat>().select(WxGroupChat::getExtChatId)
                            .eq(WxGroupChat::getExtCorpId, extCorpId)
                            .eq(WxGroupChat::getOwner, JwtUtil.getExtUserId())))
                    .orElse(new ArrayList<>()).stream().map(WxGroupChat::getExtChatId).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(chatExtIds)) {
                list = groupChatStatisticsService.list(queryWrapper.in(WxGroupChatStatistics::getExtChatId, chatExtIds));
            }
        } else {
            list = groupChatStatisticsService.list(queryWrapper);
        }

        long total = count(new LambdaQueryWrapper<WxGroupChat>().eq(WxGroupChat::getExtCorpId, extCorpId)
                .in(WxGroupChat::getStatus, Arrays.asList(WxGroupChat.STATUS_NORMAL, WxGroupChat.STATUS_FINISH))
                .eq(Optional.ofNullable(isPermission).orElse(false) && !roleStaffService.isEnterpriseAdmin(), WxGroupChat::getOwner, JwtUtil.getExtUserId()));

        final long[] customerNum = {0};
        final long[] joinMemberNum = {0};
        final long[] quitMemberNum = {0};
        Optional.ofNullable(list).orElse(new ArrayList<>()).forEach(wxGroupChatStatistics -> {
            customerNum[0] = wxGroupChatStatistics.getCustomerNum() + customerNum[0];
            joinMemberNum[0] = wxGroupChatStatistics.getJoinMemberNum() + joinMemberNum[0];
            quitMemberNum[0] = wxGroupChatStatistics.getQuitMemberNum() + quitMemberNum[0];
        });

        return new WxGroupChatTodayStatisticsVO()
                .setJoinMemberNum(joinMemberNum[0])
                .setQuitMemberNum(quitMemberNum[0])
                .setTotalMember(total);
    }

    public void delete(WxGroupChat groupChat) {

        if (groupChat == null) {
            return;
        }
        String chatExtId = groupChat.getExtChatId();
        String extCorpId = groupChat.getExtCorpId();
        groupChatTagMapService.remove(new LambdaQueryWrapper<WxGroupChatTagMap>().eq(WxGroupChatTagMap::getGroupChatId, groupChat.getId()));
        groupChatStatisticsService.remove(new LambdaQueryWrapper<WxGroupChatStatistics>()
                .eq(WxGroupChatStatistics::getExtCorpId, extCorpId)
                .eq(WxGroupChatStatistics::getExtChatId, chatExtId));
        groupChatMemberService.remove(new LambdaQueryWrapper<WxGroupChatMember>()
                .eq(WxGroupChatMember::getExtCorpId, extCorpId)
                .eq(WxGroupChatMember::getExtChatId, chatExtId));
        removeById(groupChat.getId());
        groupChatTransferInfoService.remove(new LambdaQueryWrapper<WxGroupChatTransferInfo>()
                .eq(WxGroupChatTransferInfo::getExtCorpId, extCorpId)
                .eq(WxGroupChatTransferInfo::getGroupChatExtId, chatExtId));
    }


    @Override
    public WxGroupChat checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxGroupChat byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户群不存在");
        }
        return byId;
    }


    @Override
    public WxGroupChat checkExists(String extCorpId, String extChatId) {
        return getOne(new LambdaQueryWrapper<WxGroupChat>().eq(WxGroupChat::getExtCorpId, extCorpId).eq(WxGroupChat::getExtChatId, extChatId));
    }

    @Override
    public void sync(String extCorpId, String id) throws WxErrorException {
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        List<WxCpUserExternalGroupChatList.ChatStatus> groupChatList = new ArrayList<>();
        //同步单条
        if (StringUtils.isNotBlank(id)) {
            WxGroupChat groupChat = checkExists(id);
            String extChatId = groupChat.getExtChatId();
            WxCpUserExternalGroupChatList.ChatStatus chatStatus = new WxCpUserExternalGroupChatList.ChatStatus();
            chatStatus.setChatId(extChatId);
            groupChatList.add(chatStatus);
            saveOrUpdate(extCorpId, extChatId, chatStatus.getStatus(), externalContactService);
        } else {
            //全量同步
            //调用批量获取客户群聊接口（每次最多只能获取1000条数据，因此得递归分页获取所有的）
            WxCpUserExternalGroupChatList wxCpUserExternalGroupChatList = externalContactService.listGroupChat(1000, null, 0, null);
            String nextCursor = wxCpUserExternalGroupChatList.getNextCursor();
            groupChatList = wxCpUserExternalGroupChatList.getGroupChatList();
            List<String> allExtIds = staffService.getAllExtId(extCorpId);
            getGroupChatList(nextCursor, groupChatList, externalContactService, allExtIds.toArray(new String[0]));

            //删除不存在的群聊，跟进状态不为:跟进人正常的
            List<String> existGroupIds = Optional.ofNullable(groupChatList).orElse(new ArrayList<>()).stream().map(groupChat ->
                    {
                        WxGroupChat chat = saveOrUpdate(extCorpId, groupChat.getChatId(), groupChat.getStatus(), externalContactService);
                        if (chat == null) {
                            chat = checkExists(extCorpId, groupChat.getChatId());
                            if (chat != null) {
                                chat.setStatus(groupChat.getStatus());
                                updateById(chat);
                            }
                        }
                        return chat;
                    })
                    .filter(Objects::nonNull).map(WxGroupChat::getId).collect(Collectors.toList());
            List<WxGroupChat> unExistList = list(new LambdaQueryWrapper<WxGroupChat>()
                    .eq(WxGroupChat::getExtCorpId, extCorpId)
                    .notIn(ListUtils.isNotEmpty(existGroupIds), WxGroupChat::getId, existGroupIds));
            Optional.ofNullable(unExistList).orElse(new ArrayList<>()).forEach(this::delete);
        }


    }

    @Override
    public WxGroupChat saveOrUpdate(String extCorpId, String chatId, Integer status, WxCpExternalContactService externalContactService) {

        //调用微信接口获取群组信息
        WxCpUserExternalGroupChatInfo.GroupChat groupChatInfo;
        try {
            groupChatInfo = externalContactService.getGroupChat(chatId, 1).getGroupChat();
        } catch (WxErrorException e) {
            if (Objects.equals(WxErrorEnum.CODE_701008.getCode(), e.getError().getErrorCode())) {
                log.info("群聊同步，没有互通账号， 直接返回~");
                return null;
            } else {
                throw BaseException.buildBaseException(e.getError(), "同步群聊异常");
            }
        }
        List<WxCpUserExternalGroupChatInfo.GroupAdmin> adminList = groupChatInfo.getAdminList();
        List<WxCpUserExternalGroupChatInfo.GroupMember> memberList = groupChatInfo.getMemberList();
        List<String> adminIds = Optional.ofNullable(adminList).orElse(new ArrayList<>()).stream().map(WxCpUserExternalGroupChatInfo.GroupAdmin::getUserId).collect(Collectors.toList());

        //更新群组数据
        WxGroupChat oldGroupChat = checkExists(extCorpId, groupChatInfo.getChatId());
        WxGroupChat wxGroupChat = new WxGroupChat().setAdminList(JSON.toJSONString(adminIds))
                .setExtCorpId(extCorpId)
                .setCreatedAt(new Date())
                .setCreateTime(new Date(groupChatInfo.getCreateTime() * 1000))
                .setId(UUID.get32UUID())
                .setExtChatId(groupChatInfo.getChatId())
                .setOwner(groupChatInfo.getOwner())
                .setName(groupChatInfo.getName())
                .setExtCreatorId(groupChatInfo.getOwner())
                .setTotal(Optional.ofNullable(memberList).orElse(new ArrayList<>()).size())
                .setNotice(groupChatInfo.getNotice())
                .setUpdatedAt(new Date());

        //群聊统计信息
        WxGroupChatStatistics groupChatStatistics = groupChatStatisticsService.getToday(extCorpId, wxGroupChat.getExtChatId());

        //同步群组成员数据
        AtomicReference<Integer> customerNum = new AtomicReference<>(0);

        AtomicReference<Integer> todayJoinMemberNum = new AtomicReference<>(0);
        List<String> memberIds = new ArrayList<>();
        Optional.ofNullable(memberList).orElse(new ArrayList<>()).forEach(member -> {

            if (WxGroupChatMember.TYPE_EXTERNAL_CONTACT == member.getType()) {
                customerNum.set(customerNum.get() + 1);
            }

            WxGroupChatMember oldGroupChatMember = groupChatMemberService.getOne(
                    new LambdaQueryWrapper<WxGroupChatMember>()
                            .eq(WxGroupChatMember::getExtCorpId, extCorpId)
                            .eq(WxGroupChatMember::getExtChatId, wxGroupChat.getExtChatId())
                            .eq(WxGroupChatMember::getUserId, member.getUserId())
            );

            WxGroupChatMember wxGroupChatMember = new WxGroupChatMember()
                    .setId(UUID.get32UUID())
                    .setExtChatId(wxGroupChat.getExtChatId())
                    .setExtCorpId(extCorpId)
                    .setName(member.getName())
                    .setGroupNickname(member.getGroupNickname())
                    .setUnionId(member.getUnionId())
                    .setUserId(member.getUserId())
                    .setInvitor(Optional.ofNullable(member.getInvitor()).orElse(new WxCpUserExternalGroupChatInfo.Invitor()).getUserId())
                    .setType(member.getType())
                    .setJoinTime(member.getJoinTime())
                    .setJoinScene(member.getJoinScene());

            if (Objects.equals(member.getUserId(), wxGroupChat.getOwner())) {
                wxGroupChat.setOwnerName(member.getName());
            }

            if (oldGroupChatMember != null) {
                wxGroupChatMember.setId(oldGroupChatMember.getId());
                groupChatMemberService.updateById(wxGroupChatMember);
            } else {
                groupChatMemberService.save(wxGroupChatMember);
                //客户动态
                CustomerDynamicInfoDTO dynamicInfoDTO = new CustomerDynamicInfoDTO()
                        .setChatExtId(wxGroupChat.getExtChatId())
                        .setChatName(wxGroupChat.getName());
                customerDynamicService.save(BrCustomerDynamicModelEnum.CUSTOMER_BASE.getCode(),
                        BrCustomerDynamicTypeEnum.JOIN_GROUP_CHAT.getCode(),
                        extCorpId, null, member.getUserId(),
                        dynamicInfoDTO);
            }

            //如果是当天加入的,累计当天入群数量
            if (DateUtils.isToday(wxGroupChatMember.getJoinTime() * 1000)) {
                todayJoinMemberNum.getAndSet(todayJoinMemberNum.get() + 1);
            }

            memberIds.add(wxGroupChatMember.getId());
        });

        int quitMemberNum = 0;

        //如果该群聊存在，删除已经不存在的客户
        if (oldGroupChat != null) {

            //该群聊存在的客户ids
            List<String> existMemberIds = Optional.ofNullable(groupChatMemberService.list(new LambdaQueryWrapper<WxGroupChatMember>()
                            .select(WxGroupChatMember::getId)
                            .eq(WxGroupChatMember::getExtCorpId, extCorpId)
                            .eq(WxGroupChatMember::getExtChatId, oldGroupChat.getExtChatId()))).orElse(new ArrayList<>())
                    .stream().map(WxGroupChatMember::getId).collect(Collectors.toList());
            existMemberIds.removeAll(memberIds);

            //删除不存在的
            if (ListUtils.isNotEmpty(existMemberIds)) {

                //计算今日退群人数
                // 今日退群成员 = 今日退群成员（去重） - 还存在的成员
                List<String> todayQuitIds = Optional.ofNullable(groupChatMemberService.queryTodayQuitIds(extCorpId, chatId)).orElse(new ArrayList<>());
                todayQuitIds.addAll(existMemberIds);
                if (ListUtils.isNotEmpty(memberIds)) {
                    //去除还在的客户
                    todayQuitIds.removeAll(memberIds);
                }
                quitMemberNum = Optional.of(todayQuitIds.stream().distinct().collect(Collectors.toList())).orElse(new ArrayList<>()).size();

                //给退出的成员设置退群时间
                groupChatMemberService.update(new LambdaUpdateWrapper<WxGroupChatMember>()
                        .eq(WxGroupChatMember::getExtCorpId, extCorpId)
                        .in(WxGroupChatMember::getId, existMemberIds)
                        .set(WxGroupChatMember::getQuitTime, new Date()));

                //删除不存在的
                groupChatMemberService.removeByIds(existMemberIds);

                //客户动态
                CustomerDynamicInfoDTO dynamicInfoDTO = new CustomerDynamicInfoDTO()
                        .setChatExtId(oldGroupChat.getExtChatId())
                        .setChatName(oldGroupChat.getName());
                existMemberIds.forEach(memberId ->
                        customerDynamicService.save(BrCustomerDynamicModelEnum.CUSTOMER_BASE.getCode(),
                                BrCustomerDynamicTypeEnum.EXIT_GROUP_CHAT.getCode(),
                                extCorpId, null, memberId, dynamicInfoDTO));

            }

        }

        //更新群组数据
        wxGroupChat.setCustomerNum(customerNum.get());
        if (oldGroupChat != null) {
            wxGroupChat.setId(oldGroupChat.getId()).setStatus(status == null ? oldGroupChat.getStatus() : status);
            updateById(wxGroupChat);
        } else {
            save(wxGroupChat.setStatus(status));
        }


        groupChatStatistics.setQuitMemberNum(quitMemberNum)
                .setJoinMemberNum(todayJoinMemberNum.get() + quitMemberNum)
                .setTotal(wxGroupChat.getTotal())
                .setCustomerNum(wxGroupChat.getCustomerNum());
        groupChatStatisticsService.updateById(groupChatStatistics);

        return wxGroupChat;

    }

    @Override
    public void exportList(WxGroupChatExportDTO dto) {

        LambdaQueryWrapper<WxGroupChat> wrapper = new LambdaQueryWrapper<WxGroupChat>()
                .eq(WxGroupChat::getExtCorpId, dto.getExtCorpId())
                .in(ListUtils.isNotEmpty(dto.getOwnerIds()), WxGroupChat::getOwner, dto.getOwnerIds())
                .like(StringUtils.isNotBlank(dto.getName()), WxGroupChat::getName, dto.getName());

        //根据名称筛选群主
        if (StringUtils.isNotBlank(dto.getOwnerName())) {
            List<String> extIds = Optional.ofNullable(
                    staffService.list(new LambdaQueryWrapper<Staff>()
                            .select(Staff::getExtId)
                            .eq(Staff::getExtCorpId, dto.getExtCorpId())
                            .like(Staff::getName, dto.getOwnerName()))
            ).orElse(new ArrayList<>()).stream().map(Staff::getExtId).collect(Collectors.toList());
            wrapper.in(ListUtils.isNotEmpty(extIds), WxGroupChat::getOwner, extIds);
        }

        //根据名称筛选标签
        if (StringUtils.isNotBlank(dto.getTagName())) {

            List<String> tagIds = Optional.ofNullable(groupChatTagService.list(new LambdaQueryWrapper<WxGroupChatTag>()
                            .select(WxGroupChatTag::getId)
                            .eq(WxGroupChatTag::getExtCorpId, dto.getExtCorpId())
                            .like(WxGroupChatTag::getName, dto.getTagName()))).orElse(new ArrayList<>())
                    .stream().map(WxGroupChatTag::getId).collect(Collectors.toList());

            if (ListUtils.isNotEmpty(tagIds)) {
                List<String> groupChatIds = Optional.ofNullable(
                                groupChatTagMapService.list(new LambdaQueryWrapper<WxGroupChatTagMap>()
                                        .select(WxGroupChatTagMap::getGroupChatId)
                                        .in(WxGroupChatTagMap::getGroupChatTagId, tagIds))).orElse(new ArrayList<>())
                        .stream().map(WxGroupChatTagMap::getGroupChatId).collect(Collectors.toList());
                wrapper.in(ListUtils.isNotEmpty(groupChatIds), WxGroupChat::getId, groupChatIds);
            }

        }
        wrapper.orderByAsc(WxGroupChat::getCreateTime);

        Department rootDepartment = departmentService.getRootDepartment(dto.getExtCorpId());

        List<WxGroupChatExportVO> exportVOS = new ArrayList<>();
        Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList()).forEach(groupChat -> {
            WxGroupChatVO vo = translation(groupChat);
            WxGroupChatExportVO exportVO = new WxGroupChatExportVO();
            BeanUtils.copyProperties(vo, exportVO);
            StaffVO staffVO = Optional.ofNullable(vo.getOwnerInfo()).orElse(new StaffVO());

            exportVO.setName(StringUtils.isNotBlank(groupChat.getName()) ? groupChat.getName() : "未命名群聊")
                    .setOwnerName(staffVO.getName());
            StringBuilder sb = new StringBuilder();
            if (ListUtils.isNotEmpty(staffVO.getDepartmentList())) {
                staffVO.getDepartmentList().forEach(s -> {
                    if (StringUtils.isNotBlank(sb.toString())) {
                        sb.append(",");
                    }
//                    sb.append("$departmentName=").append(s.getExtId()).append("$");
                });
            } else {
                sb.append(rootDepartment.getName());
            }
//            exportVO.setOwnerDeptName(sb.toString());
//            exportVO.setOwnerName("$userName=" + staffVO.getExtId() + "$");
            exportVOS.add(exportVO);
        });

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String title = "客户群列表(导出时间: %s)";
        title = String.format(title, dateFormat.format(new Date()));
        EasyPoiUtils.export("客户群数据列表", title, null, WxGroupChatExportVO.class, exportVOS);

    }

    @Override
    public List<WxGroupChat> queryList(WxGroupChatQueryDTO dto) {
        return Optional.ofNullable(list(buildQuery(dto))).orElse(new ArrayList<>());
    }

    @Override
    public void exportStaticsInfo(WxGroupChatStatisticsInfoExportDTO dto) {
        WxGroupChat groupChat = checkExists(dto.getId());
        List<WxGroupChatStatistics> list = groupChatStatisticsService.list(new LambdaQueryWrapper<WxGroupChatStatistics>()
                .eq(WxGroupChatStatistics::getExtCorpId, groupChat.getExtCorpId())
                .eq(WxGroupChatStatistics::getExtChatId, groupChat.getExtChatId())
                .le(dto.getEndTime() != null, WxGroupChatStatistics::getCreateDate, dto.getEndTime())
                .ge(dto.getBeginTime() != null, WxGroupChatStatistics::getCreateDate, dto.getBeginTime()));

        List<WxGroupChatStatisticsInfoExportVO> exportVOS = Optional.ofNullable(list).orElse(new ArrayList<>()).stream().map(groupChatStatistics -> new WxGroupChatStatisticsInfoExportVO()
                .setActiveMemberNum(groupChatStatistics.getActiveMemberNum())
                .setActiveMemberNum(groupChatStatistics.getActiveMemberNum())
                .setCreateDate(groupChatStatistics.getCreateDate())
                .setJoinMemberNum(groupChatStatistics.getJoinMemberNum())
                .setQuitMemberNum(groupChatStatistics.getQuitMemberNum())
                .setTotal(groupChatStatistics.getTotal())).collect(Collectors.toList());

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String title = "%s客户群统计信息(导出时间: %s)";
        title = String.format(title, StringUtils.isNotBlank(groupChat.getName()) ? groupChat.getName() : "未命名群聊", dateFormat.format(new Date()));
        EasyPoiUtils.export("客户群数据列表", title, null, WxGroupChatStatisticsInfoExportVO.class, exportVOS, ServletUtils.getResponse(), ServletUtils.getRequest());

    }

    /**
     * 构造查询条件
     */
    private LambdaQueryWrapper<WxGroupChat> buildQuery(WxGroupChatQueryDTO dto) {
        LambdaQueryWrapper<WxGroupChat> wrapper = new LambdaQueryWrapper<WxGroupChat>()
                .eq(WxGroupChat::getExtCorpId, dto.getExtCorpId());
        //选择全部群聊
        if (dto.getHasAllGroup()) {
            return wrapper;
        }
        //群聊id集合过滤
        if (ListUtils.isNotEmpty(dto.getGroupIds())) {
            wrapper.in(WxGroupChat::getExtChatId, dto.getGroupIds());
            return wrapper;
        }

        //群聊创建起始时间,结束时间，群名关键字过滤
        wrapper.like(StringUtils.isNotBlank(dto.getGroupName()), WxGroupChat::getName, dto.getGroupName())
                .le(dto.getEndTime() != null, WxGroupChat::getCreateTime, DateUtils.strToDate(DateUtils.dateToSimpleStr(dto.getEndTime()) + " 23:59:00"))
                .ge(dto.getStartTime() != null, WxGroupChat::getCreateTime, dto.getStartTime());

        //群标签过滤，满足其一即可
        if (ListUtils.isNotEmpty(dto.getGroupTags())) {
            List<String> groupChatIds = Optional.ofNullable(
                            groupChatTagMapService.list(new LambdaQueryWrapper<WxGroupChatTagMap>()
                                    .select(WxGroupChatTagMap::getGroupChatId)
                                    .in(WxGroupChatTagMap::getGroupChatTagId, dto.getGroupTags()))).orElse(new ArrayList<>())
                    .stream().map(WxGroupChatTagMap::getGroupChatId).collect(Collectors.toList());
            wrapper.in(ListUtils.isNotEmpty(groupChatIds), WxGroupChat::getId, groupChatIds);
        }

        //群主过滤
        List<String> leaderIds = staffService.getStaffIdsByDepts(dto.getExtCorpId(), dto.getDepartmentIds(), dto.getLeaderIds());
        if (ListUtils.isNotEmpty(leaderIds)) {
            wrapper.in(WxGroupChat::getOwner, leaderIds);
        }

        return wrapper;
    }

    @Override
    public IPage<WxGroupChatStatisticsInfoVO> getStaticsInfo(WxGroupChatStatisticsInfoDTO dto) {
        WxGroupChat groupChat = checkExists(dto.getId());
        IPage<WxGroupChatStatistics> page = groupChatStatisticsService.page(new Page<>(dto.getPageNum(), dto.getPageSize()),
                new LambdaQueryWrapper<WxGroupChatStatistics>()
                        .eq(WxGroupChatStatistics::getExtCorpId, groupChat.getExtCorpId())
                        .eq(WxGroupChatStatistics::getExtChatId, groupChat.getExtChatId())
                        .le(dto.getEndTime() != null, WxGroupChatStatistics::getCreateDate, dto.getEndTime())
                        .ge(dto.getBeginTime() != null, WxGroupChatStatistics::getCreateDate, dto.getBeginTime())
                        .orderByAsc(WxGroupChatStatistics::getCreateDate)
        );
        return page.convert(this::translationStatics);
    }

    private WxGroupChatStatisticsInfoVO translationStatics(WxGroupChatStatistics groupChatStatistics) {
        WxGroupChatStatisticsInfoVO wxGroupChatStatisticsInfoVO = new WxGroupChatStatisticsInfoVO();
        BeanUtils.copyProperties(groupChatStatistics, wxGroupChatStatisticsInfoVO);
        return wxGroupChatStatisticsInfoVO;
    }

    private void getGroupChatList(String nextCursor, List<WxCpUserExternalGroupChatList.ChatStatus> groupChatList, WxCpExternalContactService externalContactService, String[] userIds) throws WxErrorException {
        if (StringUtils.isNotBlank(nextCursor)) {
            WxCpUserExternalGroupChatList wxCpUserExternalGroupChatList = externalContactService.listGroupChat(1000, null, 0, userIds);
            nextCursor = wxCpUserExternalGroupChatList.getNextCursor();
            groupChatList.addAll(wxCpUserExternalGroupChatList.getGroupChatList());
            getGroupChatList(nextCursor, groupChatList, externalContactService, userIds);
        }
    }


}
