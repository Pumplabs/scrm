package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;


/**
 * @author ouyang
 * @description 生成定时任务所需参数
 * @date 2022/4/10
 **/
@Data
@Accessors(chain = true)
public class XxlJobInfoDTO {

    private Integer id;

    private Integer jobGroup;

    //任务描述
    private String jobDesc;

    //负责人
    private String author;

    //告警邮箱
    private String alarmEmail;

    //定时任务执行的cron表达式
    private String cron;

    //定义的定时任务名称
    private String executorHandler;

    //定时任务传参
    private String executorParam;

}