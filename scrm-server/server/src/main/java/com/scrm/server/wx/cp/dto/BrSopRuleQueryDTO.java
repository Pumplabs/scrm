package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@ApiModel(value = "sop规则条件查询请求参数")
@Accessors(chain = true)
public class BrSopRuleQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("sopId")
    @NotBlank(message = "sopId不能为空")
    private String sopId;

}
