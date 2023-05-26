package com.scrm.server.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableLogic;
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
 * 客户跟进的消息
 * @author xxh
 * @since 2022-05-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户跟进的消息")
@TableName("br_customer_follow_msg")
public class BrCustomerFollowMsg implements Serializable{

    private static final long serialVersionUID=1L;

    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "跟进id")
    private String followId;

    @ApiModelProperty(value = "回复id")
    private String replyId;

    @ApiModelProperty(value = "是否是回复，1->回复， 0->跟进")
    private Boolean hasReply;

    @ApiModelProperty(value = "员工id")
    private String extStaffId;

    @ApiModelProperty(value = "是否已读")
    private Boolean hasRead;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;


}
