package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author xuxh
 * @date 2022/6/6 16:52
 */
@Data
@ApiModel(value = "企业微信客户统计DTO")
public class WxCustomerStatisticsDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

}
