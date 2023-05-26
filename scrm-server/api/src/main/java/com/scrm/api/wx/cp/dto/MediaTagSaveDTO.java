package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-03-13
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业微信标签管理新增DTO")
public class MediaTagSaveDTO {


    @ApiModelProperty(value = "标签组ID",required = true)
    @NotBlank(message = "标签组ID不能为空")
    private String groupId;

    @ApiModelProperty(value = "标签名称",required = true)
    @NotBlank(message = "标签名称不能为空")
    private String name;

    @ApiModelProperty(value = "标签顺序",required = true)
    private Integer order;
}
