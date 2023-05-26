package com.scrm.server.wx.cp.schedule;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.entity.BrCorpAccredit;
import com.scrm.common.util.DateUtils;
import com.scrm.server.wx.cp.service.IBrCorpAccreditService;
import com.scrm.server.wx.cp.service.IBrReportSaleService;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/8/2 14:46
 * @description：报表定时任务
 **/
@Slf4j
@Service
public class ReportTask {
    
    @Autowired
    private IBrReportSaleService reportEverydayService;
    
    @Autowired
    private IBrCorpAccreditService corpAccreditService;
    
    @Autowired
    private IStaffService staffService;

    String contentFormat = "%s 销售日报\n" +
            "<a href=\"%s\">请查看-></a>";
    
    /**
     * 每晚八点生成当日销售日报
     * 统计当天0-20点信息，20-24点信息不要
     */
    @Scheduled(cron = "0 0 20 * * ? ")
    @SchedulerLock(name = "createSaleReportSchedule", lockAtMostFor = "60000", lockAtLeastFor = "60000")
    public void createSaleReport(){
        log.info("开始生成每日报表");
        Set<String> corpIds = corpAccreditService.list(new QueryWrapper<BrCorpAccredit>().lambda()
                .select(BrCorpAccredit::getCorpId))
                .stream().map(BrCorpAccredit::getCorpId).collect(Collectors.toSet());

        corpIds.forEach(extCorpId -> {
                    new Thread(() -> {
                        //生成报表
                        String reportId = reportEverydayService.buildTodayReport(extCorpId);
                        //发送内容
                        String content = String.format(contentFormat, 
                                DateUtils.dateToSimpleStr(new Date()), 
                                ScrmConfig.getSaleReportUrl() + reportId);
                        //发给每个员工
                        Set<String> staffIds = staffService.list(new QueryWrapper<Staff>().lambda()
                                .eq(Staff::getExtCorpId, extCorpId))
                                .stream().map(Staff::getExtId).collect(Collectors.toSet());
                        WxMsgUtils.sendMessage(extCorpId, content, staffIds);
                    }).start();
                }
        );

    }
    
}
