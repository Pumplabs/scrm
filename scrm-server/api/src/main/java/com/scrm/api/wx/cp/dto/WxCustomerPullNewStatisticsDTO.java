package com.scrm.api.wx.cp.dto;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@ApiModel(value = "企业微信客户拉新统计DTO")
public class WxCustomerPullNewStatisticsDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "排行数量",required = true)
    @NotNull(message = "排行数量不能为空")
    private Integer topNum;

}
