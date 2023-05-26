package com.scrm.server.wx.cp.schedule;

import com.alibaba.fastjson.JSONObject;
import com.scrm.api.wx.cp.entity.WxTempFile;
import com.scrm.server.wx.cp.service.IWxTempFileService;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/1/7 23:34
 * @description：文件相关定时任务
 **/
@Component()
@EnableScheduling
@Lazy(false)
@Slf4j
public class FileTask {

    @Autowired
    private IWxTempFileService wxTempFileService;

    /**
     * 每天晚上0点到第二天早上3点，处理过期文件
     */
    @Scheduled(cron = "11 24 0-3 * * ? ")
    @SchedulerLock(name = "handleExpireFileSchedule", lockAtMostFor = "60000", lockAtLeastFor = "60000")
    @Transactional
    public void handleExpireFile(){
        log.info("开始执行处理过期文件的定时任务");
        try {
            List<WxTempFile> expireFiles = wxTempFileService.getExpireFileForTask();
            log.info("过期的文件=[{}]", JSONObject.toJSONString(expireFiles));
            expireFiles.forEach(file -> {

                try {
                    wxTempFileService.handleExpireFile(file);
                }catch (Exception e){
                    log.error("处理过期文件[{}]异常", JSONObject.toJSONString(file), e);
                }

            });
            log.info("执行处理过期文件的定时任务结束");
        }catch (Exception e){
            log.error("执行处理过期文件的定时任务出错，", e);
        }
    }

//    @Scheduled(cron = "0 * * * * ? ")
//    @SchedulerLock(name = "testLockSchedule1", lockAtMostFor = "1000", lockAtLeastFor = "1000")
//    public void testLock(){
//        log.info("定时任务启动了...");
//    }
}
