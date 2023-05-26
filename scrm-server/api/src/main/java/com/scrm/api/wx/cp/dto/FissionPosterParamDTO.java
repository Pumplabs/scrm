package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;


@Data
@ApiModel("企微应用宝获取海报参数")
public class FissionPosterParamDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotBlank(message = "企业id必填")
    private String corpId;

    @ApiModelProperty(value = "任务id")
    @NotBlank(message = "任务id必填")
    private String taskId;

    @ApiModelProperty(value = "客户extId")
    @NotBlank(message = "客户extId必填")
    private String extCustomerId;

}
