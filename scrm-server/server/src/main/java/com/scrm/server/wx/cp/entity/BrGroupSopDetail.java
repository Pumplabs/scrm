package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 群sop-规则执行详情表
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群sop-规则执行详情表")
@TableName(value = "br_group_sop_detail", autoResultMap = true)
public class BrGroupSopDetail implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键id")
    @TableId
    private String id;

    @ApiModelProperty(value = "规则id")
    private String ruleId;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建员工id")
    private String creator;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;

    @ApiModelProperty(value = "发送状态：0-未发送 1-已发送 2-因客户不是好友导致发送失败 3-因客户已经收到其他群发消息导致发送失败")
    private Integer sendStatus;

    @ApiModelProperty(value = "发送时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date sendTime;

    @ApiModelProperty(value = "企业群发消息的id，可用于获取群发消息发送结果")
    private String extMsgId;

    @ApiModelProperty(value = "员工id")
    private String extStaffId;

    @ApiModelProperty(value = "群聊id")
    private String extChatId;

    @ApiModelProperty(value = "规则执行时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date executeAt;


    @ApiModelProperty(value = "所属sop名称")
    private String sopName;

    @ApiModelProperty(value = "消息内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO msg;

    @ApiModelProperty(value = "执行方式，1:仅提醒 2:群发 3:朋友圈")
    private Integer way;

    @ApiModelProperty(value = "所属定时任务id")
    private Integer jobId;

}
