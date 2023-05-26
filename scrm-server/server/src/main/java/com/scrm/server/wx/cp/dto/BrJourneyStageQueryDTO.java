package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-04-06
 */
@Data
@ApiModel(value = "旅程阶段条件查询请求参数")
@Accessors(chain = true)
public class BrJourneyStageQueryDTO {

    @ApiModelProperty(value = "企业id",required = true)
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "旅程id")
    private String journeyId;

}
