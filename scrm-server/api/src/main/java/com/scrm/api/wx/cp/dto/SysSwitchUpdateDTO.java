package com.scrm.api.wx.cp.dto;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@ApiModel(value = "修改" )
@Accessors(chain = true)
public class SysSwitchUpdateDTO {

    @ApiModelProperty(value = "企业id", required = true)
    @NotBlank(message = "企业id不能为空" )
    private String extCorpId;

    @ApiModelProperty(value = "id", required = true)
    @NotBlank(message = "id不能为空" )
    private String id;

    @ApiModelProperty(value = "开关状态 0:关 1:开", required = true)
    @NotNull(message = "开关状态不能为空" )
    private Integer status;

}
