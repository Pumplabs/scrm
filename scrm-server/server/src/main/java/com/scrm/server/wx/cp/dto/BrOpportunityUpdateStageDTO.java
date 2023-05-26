package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "商机修改阶段请求参数")
public class BrOpportunityUpdateStageDTO {

    @ApiModelProperty(value = "主键id")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "阶段id")
    @NotBlank(message = "阶段id不能为空")
    private String stageId;

    @ApiModelProperty(value = "失败原因id")
    private String failReasonId;

    @ApiModelProperty(value = "失败原因")
    private String failReason;

}
