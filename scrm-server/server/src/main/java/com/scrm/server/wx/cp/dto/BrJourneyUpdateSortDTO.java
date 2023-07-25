package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel(value = "旅程信息修改请求参数")
public class BrJourneyUpdateSortDTO {

    @ApiModelProperty(value = "主键", required = true)
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "旅程阶段列表", required = true)
    @NotNull(message = "旅程阶段不能为空")
    @Size(min = 1, message = "旅程阶段不能为空")
    List<BrJourneyStageSaveOrUpdateDTO> journeyStageList;


}
