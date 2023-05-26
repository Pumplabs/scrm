package com.scrm.server.wx.cp.entity;

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


/**
 * 订单-产品关联
 * @author xxh
 * @since 2022-07-25
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "订单-产品关联")
@TableName("br_order_product")
public class BrOrderProduct implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键ID")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "产品名称")
    private String productName;

    @ApiModelProperty(value = "产品ID")
    private String productId;

    @ApiModelProperty(value = "产品单价")
    private String productPrice;

    @ApiModelProperty(value = "折扣")
    private String discount;

    @ApiModelProperty(value = "产品数据")
    private Integer productNum;

    @ApiModelProperty(value = "备注")
    private String remark;

    @ApiModelProperty(value = "所属订单ID")
    private String orderId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "创建员工id")
    private String creator;

    @ApiModelProperty(value = "编辑员工id")
    private String editor;


}
