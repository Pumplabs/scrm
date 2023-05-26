package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;


@Data
@Accessors(chain = true)
@ApiModel(value = "渠道活码-分组信息修改请求参数")
public class ContactWayGroupUpdateDTO {

    @ApiModelProperty(value = "id")
    @NotNull(message = "请选择要修改的分组")
    private String id;

    @ApiModelProperty(value = "'分组名称'")
    @NotNull(message = "请选择要修改的分组名称")
    private String name;



}
