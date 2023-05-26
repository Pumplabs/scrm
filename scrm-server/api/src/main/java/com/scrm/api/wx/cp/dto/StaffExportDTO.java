package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @Author: xxh
 * @Date: 2022/1/2 16:56
 */
@Data
@ApiModel(value = "企业员工导出参数")
@Accessors(chain = true)
public class StaffExportDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "部门id")
    private String departmentId;

    @ApiModelProperty(value = "员工名")
    private String name;

    @ApiModelProperty(value = "别名")
    private String alias;
}
