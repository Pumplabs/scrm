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

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 客户跟进
 * @author xxh
 * @since 2022-05-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户跟进")
@TableName(value = "br_customer_follow", autoResultMap = true)
public class BrCustomerFollow implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "客户extId")
    private String extCustomerId;

    @ApiModelProperty(value = "这个客户的负责员工id")
    private String extStaffId;

    @ApiModelProperty(value = "跟进内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO content;

    @ApiModelProperty(value = "分享给的员工的extid")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> shareExtStaffIds;

    @ApiModelProperty(value = "创建者extid")
    private String creatorExtId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "更新时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;

    @ApiModelProperty(value = "跟进类型 1：客户 2：商机")
    private Integer type;

    @ApiModelProperty(value = "是否设置待办任务 1：是 0：否")
    private Boolean isTodo;

    @ApiModelProperty(value = "跟进提醒时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date remindAt;

    @ApiModelProperty(value = "定时任务jobId")
    private Integer jobId;

    public static final Integer CUSTOMER_TYPE = 1;

    public static final Integer OPPORTUNITY_TYPE = 2;
}
