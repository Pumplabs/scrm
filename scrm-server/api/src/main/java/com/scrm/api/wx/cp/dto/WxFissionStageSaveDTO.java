package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-阶梯任务信息表新增DTO")
public class WxFissionStageSaveDTO {

    @ApiModelProperty(value = "阶段，从小到大")
    @NotNull(message = "阶段必填")
    private Integer stage;

    @ApiModelProperty(value = "任务目标人数")
    @NotNull(message = "任务目标人数必填")
    private Integer num;

    @ApiModelProperty(value = "任务达成标签")
    private List<String> tags;

    @ApiModelProperty("领奖客服id")
    @NotNull(message = "领奖客服id必填")
    private List<String> extStaffIds;
}
