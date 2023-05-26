package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 订单
 *
 * @author xxh
 * @since 2022-07-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "订单")
@TableName(value = "br_order", autoResultMap = true)
public class BrOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键ID")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "客户extId")
    private String customerExtId;

    @ApiModelProperty(value = "负责员工extId")
    private String managerStaffExtId;

    @ApiModelProperty(value = "折扣")
    private String discount;

    @ApiModelProperty(value = "订单金额（元）")
    private String orderAmount;

    @ApiModelProperty(value = "收款金额（元）")
    private String collectionAmount;

    @ApiModelProperty(value = "描述")
    private String description;

    @ApiModelProperty(value = "附件列表")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<BrOrderAttachment> attachments;

    @ApiModelProperty(value = "订单状态 1:待审核 2:已确定 3:已完成 4:审核不通过")
    private Integer status;

    @ApiModelProperty(value = "订单编号")
    private String orderCode;

    @ApiModelProperty(value = "商机ID")
    private String opportunityId;

    @ApiModelProperty(value = "审核不通过原因")
    private String auditFailedMsg;

    @ApiModelProperty(value = "编辑员工id")
    private String editor;

    @ApiModelProperty(value = "创建员工id")
    private String creator;

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

    //订单状态 1:待审核
    public static final int STATUS_PENDING_REVIEW = 1;

    //订单状态 2:已确定
    public static final int STATUS_HAS_IDENTIFIED = 2;

    //订单状态 3:已完成
    public static final int STATUS_FINISHED = 3;

    //订单状态 4:审核不通过
    public static final int STATUS_AUDIT_FAILED = 4;




}
