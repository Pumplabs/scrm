package com.scrm.server.wx.cp.handler;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.scrm.api.wx.cp.enums.SopRuleWayEnum;
import com.scrm.api.wx.cp.enums.WxMsgSendStatusEnum;
import com.scrm.api.wx.cp.vo.IdVO;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrCustomerFollowRemindDTO;
import com.scrm.server.wx.cp.dto.BrSopMsgTaskDto;
import com.scrm.server.wx.cp.entity.*;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.CronUtil;
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
    private IWxMsgTemplateService msgTemplateService;


    @Autowired
    private IXxlJobService xxlJobService;


    @Autowired
    private IWxContactExpirationService contactExpirationService;

    @Autowired
    private IBrTodoService todoService;

    /**
     * 简单任务示例（Bean模式）
     */
    @XxlJob("demoJobHandler")
    public void demoJobHandler() throws Exception {
        long jobId = XxlJobHelper.getJobId();
        XxlJobHelper.log("XXL-JOB, Hello World.");
        System.out.println("JobID为" + jobId + "的任务在执行");
    }

    /**
     * 创建微信群发任务
     */
    @XxlJob(Constants.WX_MSG_TASK_HANDLER)
    public void wxMsgTaskHandler() throws Exception {
        Integer jobId = (int) XxlJobHelper.getJobId();
        String jobParam = XxlJobHelper.getJobParam();
        BrSopMsgTaskDto brSopMsgTaskDto = JSON.parseObject(jobParam, BrSopMsgTaskDto.class);

        List<BrSopDetail> detailList = new ArrayList<>();
        List<BrTodo> todoList = new ArrayList<>();

        setExecuteAt(brSopMsgTaskDto);

        brSopMsgTaskDto.getIdMap().forEach((staffId, customerIds) -> {
            String wxMsgId = msgTemplateService.commonSendMsg(brSopMsgTaskDto.getRule().getMsg(), staffId, customerIds, brSopMsgTaskDto.getRule().getExtCorpId());
            customerIds.forEach(customerId -> {
                detailList.add(buildSopDetail(wxMsgId, customerId, staffId, brSopMsgTaskDto, jobId));
            });
            todoList.add(buildTodo(staffId, brSopMsgTaskDto, jobId, BrTodo.SOP_TYPE));
        });

        todoService.saveBatch(todoList);

    }

    /**
     * @param
     * @return
     * @description 创建待办任务
     */
    private BrTodo buildTodo(String staffId, BrSopMsgTaskDto brSopMsgTaskDto, Integer jobId, Integer sopType) {
        BrTodo brTodo = new BrTodo();
        brTodo.setId(UUID.get32UUID()).setName(brSopMsgTaskDto.getSopName()).setCreateTime(brSopMsgTaskDto.getExecuteAt())
                .setExtCorpId(brSopMsgTaskDto.getRule().getExtCorpId()).setBusinessId(brSopMsgTaskDto.getRule().getId())
                .setStatus(BrTodo.TODO_STATUS).setType(sopType).setCreator(brSopMsgTaskDto.getRule().getCreator())
                .setOwnerExtId(staffId).setBusinessId1(String.valueOf(jobId))
                .setDeadlineTime(DateUtils.getDate(brSopMsgTaskDto.getExecuteAt(), brSopMsgTaskDto.getRule().getLimitDay(), brSopMsgTaskDto.getRule().getLimitHour()));
        return brTodo;
    }

    private BrSopDetail buildSopDetail(String wxMsgId, String customerId, String staffId, BrSopMsgTaskDto brSopMsgTaskDto, Integer jobId) {
        BrSopDetail detail = new BrSopDetail();
        detail.setId(UUID.get32UUID()).setCreatedAt(new Date()).setExtMsgId(wxMsgId).setExtCustomerId(customerId)
                .setExtStaffId(staffId).setSendStatus(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode())
                .setRuleId(brSopMsgTaskDto.getRule().getId()).setExecuteAt(brSopMsgTaskDto.getExecuteAt())
                .setExtCorpId(brSopMsgTaskDto.getRule().getExtCorpId()).setCreator(brSopMsgTaskDto.getRule().getCreator())
                .setMsg(brSopMsgTaskDto.getRule().getMsg()).setWay(brSopMsgTaskDto.getRule().getWay())
                .setSopName(brSopMsgTaskDto.getSopName()).setJobId(jobId);
        return detail;
    }

    /**
     * 应用内推送任务
     */
    @XxlJob(Constants.SEND_MSG_HANDLER)
    public void sendMsgHandler() throws Exception {
        //注意：前端传的仅提醒代表的实际功能是群发，群发操作由前端发起
        Integer jobId = (int) XxlJobHelper.getJobId();
        String jobParam = XxlJobHelper.getJobParam();
        BrSopMsgTaskDto brSopMsgTaskDto = JSON.parseObject(jobParam, BrSopMsgTaskDto.class);
        Map<String, List<String>> idMap = brSopMsgTaskDto.getIdMap();

        setExecuteAt(brSopMsgTaskDto);

        if (BrSopMsgTaskDto.SOP_TYPE.equals(brSopMsgTaskDto.getType())) {
            List<BrSopDetail> detailList = new ArrayList<>();
            List<BrTodo> todoList = new ArrayList<>();
            idMap.forEach((staffId, customerIds) -> {
                customerIds.forEach(customerId -> {
                    detailList.add(buildSopDetail(null, customerId, staffId, brSopMsgTaskDto, jobId));
                });
                //一键群发不生成待办任务
                if (!SopRuleWayEnum.MASS.getCode().equals(brSopMsgTaskDto.getRule().getWay())) {
                    todoList.add(buildTodo(staffId, brSopMsgTaskDto, jobId, BrTodo.SOP_TYPE));
                }
            });
            todoService.saveBatch(todoList);

        } else if (BrSopMsgTaskDto.GROUP_SOP_TYPE.equals(brSopMsgTaskDto.getType())) {
            List<BrGroupSopDetail> detailList = new ArrayList<>();
            List<BrTodo> todoList = new ArrayList<>();
            idMap.forEach((staffId, chatIds) -> {
                chatIds.forEach((chatId -> {
                            BrGroupSopDetail detail = new BrGroupSopDetail();
                            detail.setId(UUID.get32UUID()).setCreatedAt(new Date()).setExtChatId(chatId)
                                    .setExtStaffId(staffId).setSendStatus(WxMsgSendStatusEnum.STATUS_NO_SEND.getCode())
                                    .setRuleId(brSopMsgTaskDto.getRule().getId()).setExecuteAt(brSopMsgTaskDto.getExecuteAt())
                                    .setExtCorpId(brSopMsgTaskDto.getRule().getExtCorpId()).setCreator(brSopMsgTaskDto.getRule().getCreator())
                                    .setMsg(brSopMsgTaskDto.getRule().getMsg()).setWay(brSopMsgTaskDto.getRule().getWay())
                                    .setSopName(brSopMsgTaskDto.getSopName()).setJobId(jobId);
                            detailList.add(detail);
                        })
                );

                todoList.add(buildTodo(staffId, brSopMsgTaskDto, jobId, BrTodo.GROUP_SOP_TYPE));
            });
            todoService.saveBatch(todoList);
        }

        sendMsg(brSopMsgTaskDto, jobId);

    }

    /**
     * 循环执行的时间单独处理
     */
    private void setExecuteAt(BrSopMsgTaskDto brSopMsgTaskDto) {
        //循环的执行时间单独处理
        Date executeAt = brSopMsgTaskDto.getExecuteAt();
        Integer period = brSopMsgTaskDto.getRule().getPeriod();
        if (period != null && !CronUtil.PERIOD_NEVER.equals(period)) {
            executeAt = DateUtils.handle(executeAt, DateUtils.dateToSimpleStr(new Date()));
        }
        brSopMsgTaskDto.setExecuteAt(executeAt);
    }

    /**
     * 应用内推送方法
     */
    private void sendMsg(BrSopMsgTaskDto brSopMsgTaskDto, Integer jobId) {
        String contentFormat = "你收到【%s】\n" +
                "「%s」\n" +
                "<a href=\"%s\">点击查看详情</a>";
        String task = "";
        String href = "";
        if (SopRuleWayEnum.POST.getCode().equals(brSopMsgTaskDto.getRule().getWay())) {
            task = "发朋友圈任务";
            href = String.format(Constants.GROUP_SOP_POST, brSopMsgTaskDto.getRule().getId(), DateUtils.dateToStamp(brSopMsgTaskDto.getExecuteAt()), jobId);
        }

        if (BrSopMsgTaskDto.GROUP_SOP_TYPE.equals(brSopMsgTaskDto.getType()) && SopRuleWayEnum.REMIND.getCode().equals(brSopMsgTaskDto.getRule().getWay())) {
            task = "客户群群发任务";
            href = String.format(Constants.GROUP_SOP_REMIND, brSopMsgTaskDto.getRule().getId(), DateUtils.dateToStamp(brSopMsgTaskDto.getExecuteAt()), jobId);
        } else if (BrSopMsgTaskDto.SOP_TYPE.equals(brSopMsgTaskDto.getType()) && SopRuleWayEnum.REMIND.getCode().equals(brSopMsgTaskDto.getRule().getWay())) {
            task = "客户群发任务";
            href = String.format(Constants.SOP_REMIND, brSopMsgTaskDto.getRule().getId(), DateUtils.dateToStamp(brSopMsgTaskDto.getExecuteAt()), jobId);
        }

        WxMsgUtils.sendMessage(brSopMsgTaskDto.getRule().getExtCorpId(), String.format(contentFormat, task, brSopMsgTaskDto.getSopName(), href),
                brSopMsgTaskDto.getIdMap().keySet());

    }

    /**
     * 创建定时任务(触发条件为时间时用)
     */
    @XxlJob(Constants.CREATE_JOB_HANDLER)
    public void createJobHandler() throws Exception {
        String jobParam = XxlJobHelper.getJobParam();
        BrSopMsgTaskDto brSopMsgTaskDto = JSON.parseObject(jobParam, BrSopMsgTaskDto.class);

        Integer way = brSopMsgTaskDto.getRule().getWay();
        String handlerName;
        if (SopRuleWayEnum.MASS.getCode().equals(brSopMsgTaskDto.getRule().getWay()) && BrSopMsgTaskDto.SOP_TYPE.equals(brSopMsgTaskDto.getType())) {
            handlerName = Constants.WX_MSG_TASK_HANDLER;
        } else {
            handlerName = Constants.SEND_MSG_HANDLER;
        }
  }


    /**
     * 终止定时任务(触发条件为时间时用)
     */
    @XxlJob(Constants.STOP_JOB_HANDLER)
    public void stopJobHandler() throws Exception {
        Integer jobId = (int) XxlJobHelper.getJobId();
        String jobParam = XxlJobHelper.getJobParam();
        String ruleId = JSON.parseObject(jobParam).getString("ruleId");
        Integer type = JSON.parseObject(jobParam).getInteger("type");

        List<Integer> jobIds = new ArrayList<>();

        jobIds.remove(jobId);
        if (ListUtils.isNotEmpty(jobIds)) {
            for (Integer id : jobIds) {
                xxlJobService.stop(id);
            }
        }

    }

    /**
     * 任务宝任务过期
     */
    @XxlJob(Constants.FISSION_TASK_EXPIRE_HANDLER)
    public void fissionTaskExpireJobHandler() {

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
