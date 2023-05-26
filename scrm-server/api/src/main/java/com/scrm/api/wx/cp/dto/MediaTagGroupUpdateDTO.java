package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import java.util.List;


@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业微信标签组管理修改请求参数")
public class MediaTagGroupUpdateDTO {

    @ApiModelProperty(value = "'ID'")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "组名字")
    private String name;

    @ApiModelProperty(value = "该标签组可用部门列表,默认0全部可用")
    private String departmentList;

    @ApiModelProperty(value = "刪除的标签id列表")
    private List<String> deleteTagIds;

    @ApiModelProperty(value = "修改的标签列表，如果为新增标签则不用传id")
    private List<MediaTagUpdateDTO> updateTags;

}
