package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author xxh
 * @since 2022-05-10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业微信话术组管理修改请求参数")
public class BrMediaSayGroupUpdateDTO {

    @ApiModelProperty(value = "'ID'")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "组名字")
    @NotBlank(message = "组名字不能为空")
    private String name;

    @ApiModelProperty(value = "该标签组可用部门列表")
    private List<String> departmentList;

    @ApiModelProperty("是否是个人分组")
    @NotNull(message = "请选择是否是个人分组")
    private Boolean hasPerson;
}
