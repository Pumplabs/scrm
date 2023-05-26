package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "sop修改状态请求参数")
public class BrSopUpdateStatusDTO {

    @ApiModelProperty(value = "主键id")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "状态 1:启用 0:禁用")
    @NotNull(message = "状态不能为空")
    private Integer status;

}
