package com.scrm.server.wx.cp.handler;

import com.alibaba.fastjson.JSON;
import com.scrm.api.wx.cp.vo.IdVO;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.server.wx.cp.dto.BrCustomerFollowRemindDTO;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * @author ouyang
 * @description 需xxl-job管理的定时任务都在此处定义
 * @date 2022/4/10
 **/
@Slf4j
@Component
public class XxlJobHandeler {


    @Autowired
    private IWxContactExpirationService contactExpirationService;

    /**
     * 任务宝任务过期
     */
    @XxlJob(Constants.FISSION_TASK_EXPIRE_HANDLER)
    public void fissionTaskExpireJobHandler() {
        String jobParam = XxlJobHelper.getJobParam();
//        fissionTaskService.over(jobParam);
        //成功时调用,返回状态码+自定义日志
        XxlJobHelper.handleSuccess("执行完成...");
    }

    @XxlJob(Constants.FISSION_CONTACT_EXPIRE_HANDLER)
    public void fissionContactExpireHandler() {
        String jobParam = XxlJobHelper.getJobParam();
        IdVO params = JSON.parseObject(jobParam, IdVO.class);
        contactExpirationService.handleExpiration(params.getExtCorpId(), params.getId());
        //成功时调用,返回状态码+自定义日志
        XxlJobHelper.handleSuccess("执行完成...");
    }

    /**
     * 跟进提醒
     */
    @XxlJob(Constants.FOLLOW_REMIND_HANDLER)
    public void followRemindHandler() {
        String jobParam = XxlJobHelper.getJobParam();
        BrCustomerFollowRemindDTO params = JSON.parseObject(jobParam, BrCustomerFollowRemindDTO.class);
        String contentFormat = "您收到一条跟进提醒，请查看 \n" +
                "<a href=\"%s\">点击查看详情</a>";
        String href = ScrmConfig.getFollowDetailUrl() + "/" + params.getFollowId() + "?timestamp=" + System.currentTimeMillis();

        WxMsgUtils.sendMessage(params.getExtCorpId(), String.format(contentFormat, href),
                Arrays.asList(params.getStaffExtId()));
    }

}
