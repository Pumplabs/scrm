package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * 客户群发，员工与客户关联表
 * @author xxh
 * @since 2022-02-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群发，员工与客户关联表")
@TableName("wx_msg_template_detail")
public class WxMsgTemplateDetail implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "微信群发id")
    private String msgTemplateId;

    @ApiModelProperty(value = "员工id")
    private String extStaffId;

    @ApiModelProperty(value = "客户id")
    private String extCustomerId;

    @ApiModelProperty(value = "发送状态：-1->失败，0->未发送 1->已发送 2->因客户不是好友导致发送失败 3->因客户已经收到其他群发消息导致发送失败")
    private Integer sendStatus;

    @ApiModelProperty(value = "发送失败时的发送失败原因")
    private String failMsg;
    
    @ApiModelProperty("发送时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date sendTime;

    @ApiModelProperty(value = "企业群发消息的id，可用于获取群发消息发送结果")
    private String extMsgId;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "'删除时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

}
