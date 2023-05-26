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
@ApiModel(value = "（素材库）企业微信标签管理修改请求参数")
public class MediaTagUpdateDTO {

    @ApiModelProperty(value = "'ID'")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "标签名称")
    private String name;

    @ApiModelProperty(value = "标签排序值，值大的在前")
    private Integer order;

}
