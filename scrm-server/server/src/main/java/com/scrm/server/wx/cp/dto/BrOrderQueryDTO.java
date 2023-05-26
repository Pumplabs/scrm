package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@ApiModel(value = "订单条件查询请求参数")
@Accessors(chain = true)
public class BrOrderQueryDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

}
