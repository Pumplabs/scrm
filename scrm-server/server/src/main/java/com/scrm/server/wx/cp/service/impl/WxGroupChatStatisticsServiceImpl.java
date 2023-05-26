package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxGroupChatMember;
import com.scrm.api.wx.cp.entity.WxGroupChatStatistics;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.mapper.WxGroupChatStatisticsMapper;
import com.scrm.server.wx.cp.service.IWxGroupChatStatisticsService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalGroupChatInfo;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 企业微信群聊统计信息 服务实现类
 *
 * @author xxh
 * @since 2022-02-17
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxGroupChatStatisticsServiceImpl extends ServiceImpl<WxGroupChatStatisticsMapper, WxGroupChatStatistics> implements IWxGroupChatStatisticsService {

    @Autowired
    private RedissonClient redissonClient;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public WxGroupChatStatistics getToday(String extCorpId, String extChatId) {

        WxGroupChatStatistics groupChatStatistics = getOne(extCorpId, extChatId);

        //如果不存在，新增一条
        if (groupChatStatistics == null) {
            RLock lock = redissonClient.getLock("WxGroupChatStatistics:" + extCorpId + ":" + extChatId);
            try {
                boolean lockRes = lock.tryLock(3, 5, TimeUnit.SECONDS);
                if (lockRes) {
                    groupChatStatistics = getOne(extCorpId, extChatId);
                    if (groupChatStatistics == null) {
                        groupChatStatistics = saveNew(extCorpId, extChatId);
                    }
                }
            } catch (InterruptedException e) {
                log.error("获取今日群统计加锁异常，", e);
                throw new BaseException("获取今日群统计异常！");
            } finally {
                //判断要解锁的key是否被当前线程持有。
                if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
        }

        return groupChatStatistics;
    }

    private WxGroupChatStatistics getOne(String extCorpId, String extChatId) {
        return getOne(new LambdaQueryWrapper<WxGroupChatStatistics>()
                .eq(WxGroupChatStatistics::getExtCorpId, extCorpId)
                .eq(WxGroupChatStatistics::getExtChatId, extChatId)
                .eq(WxGroupChatStatistics::getCreateDate, DateUtils.getTodayDate())
        );
    }

    private WxGroupChatStatistics saveNew(String extCorpId, String extChatId) {
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        WxCpUserExternalGroupChatInfo.GroupChat groupChatInfo;
        try {
            groupChatInfo = externalContactService.getGroupChat(extChatId, 1).getGroupChat();
        } catch (WxErrorException e) {
            e.printStackTrace();
            throw new BaseException(e.getError().getErrorCode(), e.getError().getErrorMsg());
        }
        List<WxCpUserExternalGroupChatInfo.GroupMember> memberList = groupChatInfo.getMemberList();

        //同步群组成员数据
        AtomicReference<Integer> customerNum = new AtomicReference<>(0);
        AtomicReference<Integer> todayJoinMemberNum = new AtomicReference<>(0);
        Optional.ofNullable(memberList).orElse(new ArrayList<>()).forEach(member -> {
            if (WxGroupChatMember.TYPE_EXTERNAL_CONTACT == member.getType()) {
                customerNum.set(customerNum.get() + 1);
            }
            //如果是当天加入的,累计当天入群数量
            if (DateUtils.isToday(member.getJoinTime() * 1000)) {
                todayJoinMemberNum.getAndSet(todayJoinMemberNum.get() + 1);
            }
        });

        WxGroupChatStatistics groupChatStatistics = new WxGroupChatStatistics()
                .setId(UUID.get32UUID())
                .setTotal(Optional.ofNullable(memberList).orElse(new ArrayList<>()).size())
                .setCustomerNum(customerNum.get())
                .setJoinMemberNum(todayJoinMemberNum.get())
                .setCreateDate(DateUtils.getTodayDate())
                .setExtChatId(extChatId)
                .setExtCorpId(extCorpId)
                .setUpdateTime(new Date());
        save(groupChatStatistics);

        return groupChatStatistics;
    }
}
