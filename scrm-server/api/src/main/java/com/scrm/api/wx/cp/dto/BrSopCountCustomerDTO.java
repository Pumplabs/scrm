package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;


@Data
@ApiModel("sop统计客户数VO")
public class BrSopCountCustomerDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "选择的标签数组")
    private List<String> chooseTags;

    @ApiModelProperty(value = "选择的员工id集合(extId)")
    private List<String> staffIds;

    @ApiModelProperty(value = "选择的部门id集合(extId)")
    private List<String> departmentIds;

}
