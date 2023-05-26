package com.scrm.api.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * 微信群聊-离职继承详情
 * @author xxh
 * @since 2022-03-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "微信群聊-离职继承详情")
@TableName("wx_group_chat_transfer_info")
public class WxGroupChatTransferInfo implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "群聊ID")
    private String groupChatExtId;

    @ApiModelProperty(value = "接替群主成员ID")
    private String takeoverStaffExtId;

    @ApiModelProperty(value = "原群主成员ID")
    private String handoverStaffExtId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;


}
