package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;


@Data
@ApiModel("企微应用宝，推广VO")
public class FissionExpandDTO {

    @ApiModelProperty("企业id")
    @NotBlank
    private String extCorpId;

    @ApiModelProperty("任务id")
    @NotBlank
    private String taskId;

    @ApiModelProperty("选择推广的客户id")
    @NotNull
    private List<String> extCustomerIds;
}
