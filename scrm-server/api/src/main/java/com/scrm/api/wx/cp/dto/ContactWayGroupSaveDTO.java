package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;

@Data
@Accessors(chain = true)
@ApiModel(value = "渠道活码-分组信息新增DTO")
public class ContactWayGroupSaveDTO {

    private String id;

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "'分组名称'")
    @NotNull(message = "分组名称不能为空")
    private String name;


}
