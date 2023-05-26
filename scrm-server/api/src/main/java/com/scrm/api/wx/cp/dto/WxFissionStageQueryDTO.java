package com.scrm.api.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-03-21
 */
@Data
@ApiModel(value = "企微应用宝-阶梯任务信息表条件查询请求参数")
@Accessors(chain = true)
public class WxFissionStageQueryDTO {

    @ApiModelProperty("企业id")
    @NotNull(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("任务id")
    private String taskId;
}
