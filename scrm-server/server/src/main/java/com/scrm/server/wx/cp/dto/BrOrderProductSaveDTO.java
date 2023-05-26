package com.scrm.server.wx.cp.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-07-25
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "订单-产品关联新增DTO")
public class BrOrderProductSaveDTO {

    
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

}
