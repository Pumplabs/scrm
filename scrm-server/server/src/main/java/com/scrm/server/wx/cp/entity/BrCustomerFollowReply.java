package com.scrm.server.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Date;

/**
 * 客户跟进回复表
 * @author xxh
 * @since 2022-05-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户跟进回复表")
@TableName(value = "br_customer_follow_reply", autoResultMap = true)
public class BrCustomerFollowReply implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "跟进id")
    private String followId;

    @ApiModelProperty(value = "回复内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO content;

    @ApiModelProperty(value = "回复人")
    private String creatorExtId;

    @ApiModelProperty("回复id")
    private String replyId;

    @ApiModelProperty("是否回复跟进，1->回复跟进，0->回复回复")
    @NotBlank(message = "请选择是回复跟进还是回复回复")
    private Boolean hasReplyFollow;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;


}
