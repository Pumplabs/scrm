package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@ApiModel(value = "商机-协作人关联条件查询请求参数")
@Accessors(chain = true)
public class BrOpportunityCooperatorQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

}
