package com.scrm.api.wx.cp.dto;


import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;


/**
 * @author xxh
 * @since 2021-12-29
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信标签组管理新增DTO")
public class WxTagGroupSaveDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "组名字", required = true)
    @NotBlank(message = "组名字不能为空")
    private String name;

    @ApiModelProperty(value = "该标签组可用部门列表,默认0全部可用")
    private String departmentList;

    @ApiModelProperty(value = "标签列表")
    private List<WxTagSaveDTO> tagList;


}
