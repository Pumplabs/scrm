package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;


@Data
@ApiModel("登记企业授权信息DTO")
public class CorpInfoDTO {

    @ApiModelProperty("企业信息id")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty("企业id（让用户填的）")
    @NotBlank(message = "请填写corpId")
    private String initCorpId;

    @ApiModelProperty("通讯录密钥（让用户填的）")
    @NotBlank(message = "请填写通讯录secret")
    private String addressListSecret;

    @ApiModelProperty("客户联系密钥（让用户填的）")
    @NotBlank(message = "请填写客户联系secret")
    private String customerContactSecret;
}
