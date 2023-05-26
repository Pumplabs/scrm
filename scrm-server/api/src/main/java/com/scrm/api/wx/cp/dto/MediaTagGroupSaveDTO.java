package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;
import java.util.List;


@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业微信标签组管理新增DTO")
public class MediaTagGroupSaveDTO {


    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填")
    private String extCorpId;

    @ApiModelProperty(value = "组名字")
    @NotNull(message = "请填写组名")
    private String name;

    @ApiModelProperty(value = "该标签组可用部门列表,默认0全部可用")
    private String departmentList;

    @ApiModelProperty(value = "标签列表")
    private List<MediaTagSaveDTO> tagList;
}
