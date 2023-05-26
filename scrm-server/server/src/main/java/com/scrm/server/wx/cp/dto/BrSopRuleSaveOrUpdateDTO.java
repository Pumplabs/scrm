package com.scrm.server.wx.cp.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * @author ouyang
 * @since 2022-04-13
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "sop规则新增更新DTO")
public class BrSopRuleSaveOrUpdateDTO {

    @ApiModelProperty(value = "主键id")
    private String id;

    @ApiModelProperty(value = "所属sopid")
    private String sopId;

    @ApiModelProperty(value = "定时任务id")
    private List<Integer> jobId;

    @ApiModelProperty(value = "规则名称")
    private String name;

    @ApiModelProperty(value = "触发条件为时间，执行时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date executeAt;

    @ApiModelProperty(value = "重复周期,1:每日 2:每周 3:每两周 4:每月 5:永不 6:自定义")
    private Integer period;

    @ApiModelProperty(value = "结束重复时间")
    private String endAt;

    @ApiModelProperty(value = "自定义间隔天数")
    private Integer customDay;

    @ApiModelProperty(value = "添加好友第几天")
    private Integer startDay;

    @ApiModelProperty(value = "添加好友，具体执行时刻")
    private String startTime;

    @ApiModelProperty(value = "执行方式，1:仅提醒 2:群发 3:朋友圈")
    private Integer way;

    @ApiModelProperty(value = "创建人")
    private String creator;

    @ApiModelProperty(value = "更新人")
    private String editor;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "消息内容")
    private WxMsgDTO msg;

    @ApiModelProperty(value = "任务截止天数")
    private Integer limitDay;

    @ApiModelProperty(value = "任务截止小时数")
    private Integer limitHour;

}
