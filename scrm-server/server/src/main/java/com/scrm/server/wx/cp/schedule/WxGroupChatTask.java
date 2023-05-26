package com.scrm.server.wx.cp.schedule;

import com.scrm.common.util.DateUtils;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import com.scrm.server.wx.cp.service.IWxGroupChatStatisticsService;
import com.scrm.server.wx.cp.service.IWxMsgGroupTemplateService;
import com.scrm.server.wx.cp.service.IWxMsgTemplateService;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

/**
 * 企业微信群聊相关定时任务
 *
 * @author xuxh
 * @date 2022/2/17 15:12
 */
@Slf4j
@Service
public class WxGroupChatTask {

    @Autowired
    private IWxGroupChatService groupChatService;

    @Autowired
    private IWxGroupChatStatisticsService groupChatStatisticsService;

    @Autowired
    private IWxMsgTemplateService wxMsgTemplateService;

    @Autowired
    private IWxMsgGroupTemplateService wxMsgGroupTemplateService;

    /**
     * 定时刷新统计信息
     *
     * @author xuxh
     * @date 2022/2/17 15:16
     */
    @Scheduled(cron = "0 0 0 1/1 * ? ")
    @SchedulerLock(name = "refreshStatisticsInfoSchedule", lockAtMostFor = "60000", lockAtLeastFor = "60000")
    public void refreshStatisticsInfo() {

        log.info("企业微信群聊相关定时任务,定时刷新统计信息开始，当前时间:[{}]", DateUtils.getTodayDateTime());
        long begin = System.currentTimeMillis();

        //新增一条统计数据
        Optional.ofNullable(groupChatService.list()).orElse(new ArrayList<>()).forEach(groupChat -> {
            try {
                groupChatStatisticsService.getToday(groupChat.getExtCorpId(), groupChat.getExtChatId());
            } catch (Exception e) {
                log.info("企业微信群聊相关定时任务,定时刷新统计信息失败，extCorpId:[{}]，extChatId:[{}],异常原因:[{}]", groupChat.getExtCorpId(), groupChat.getExtChatId(), e);
            }

        });

        log.info("企业微信群聊相关定时任务,定时刷新统计信息结束，当前时间:[{}],耗时:[{}]", DateUtils.getTodayDateTime(), System.currentTimeMillis() - begin);
    }

    /**
     * @description 定时扫描发送微信群发得消息
     * @author qiuzl
     */
    @Scheduled(cron = "0 * * * * ?")
    @SchedulerLock(name = "scanMsgTemplateTaskSchedule", lockAtMostFor = "1000", lockAtLeastFor = "1000")
    public void scanMsgTemplateTask() {
        try {
            wxMsgTemplateService.scanMsgTemplate();
            wxMsgGroupTemplateService.scanMsgGroupTemplate();
        } catch (Exception e) {
            log.info("[客户群发],扫描发送微信群发得消息异常，", e);
        }

    }

}
