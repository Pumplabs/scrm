package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户资料信息修改请求参数")
public class WxCustomerDataUpdateDTO {

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "客户extId", required = true)
    @NotBlank(message = "客户extId不能为空")
    private String customerExtId;

    @ApiModelProperty(value = "跟进员工ExtId", required = true)
    @NotBlank(message = "跟进员工ExtId不能为空")
    private String staffExtId;

    @ApiModelProperty(value = "员工对客户的备注")
    private String remark;

    @ApiModelProperty(value = "员工对此客户的描述")
    private String description;
}
