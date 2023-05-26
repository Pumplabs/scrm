package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author xxh
 * @since 2022-04-06
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "旅程新增DTO")
public class BrJourneySaveDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "名称", required = true)
    @NotBlank(message = "旅程名称不能为空")
    private String name;

    @ApiModelProperty(value = "备注")
    private String remark;

    @ApiModelProperty(value = "排序")
    private Integer sort;

    @ApiModelProperty(value = "旅程阶段列表", required = true)
    @NotNull(message = "旅程阶段不能为空")
    @Size(min = 1, message = "旅程阶段不能为空")
    List<BrJourneyStageSaveOrUpdateDTO> journeyStageList;


}
