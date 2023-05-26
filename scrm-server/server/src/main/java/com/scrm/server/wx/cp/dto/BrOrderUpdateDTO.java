package com.scrm.server.wx.cp.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.server.wx.cp.entity.BrOrderAttachment;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "订单修改请求参数")
public class BrOrderUpdateDTO {

    @ApiModelProperty(value = "主键ID",required = true)
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "客户extId", required = true)
    @NotBlank(message = "客户不能为空")
    private String customerExtId;

    @ApiModelProperty(value = "负责员工extId", required = true)
    @NotBlank(message = "负责员工不能为空")
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
    private List<BrOrderAttachment> attachments;

    @ApiModelProperty(value = "订单状态 1:待审核 2:已确定 3:已完成 4:审核不通过")
    private Integer status;

    @ApiModelProperty(value = "订单编号")
    private String orderCode;

    @ApiModelProperty(value = "商机ID")
    private String opportunityId;

    @ApiModelProperty(value = "审核不通过原因")
    private String auditFailedMsg;

    @ApiModelProperty(value = "关联产品列表")
    private List<BrOrderProductSaveOrUpdateDTO> productList;



}
