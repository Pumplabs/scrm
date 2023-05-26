package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import io.swagger.annotations.ApiModel;

import javax.validation.constraints.NotBlank;


@Data
@ApiModel(value = "企业微信部门分页请求参数")
public class DepartmentPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "上级部门ID,根部门为1")
    private Long extParentId;

    @ApiModelProperty(value = "企业id", required = true)
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;
}

