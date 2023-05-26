package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @Author: xxh
 * @Date: 2022/1/2 21:11
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信标签新增DTO")
public class WxTagDTO {

    @ApiModelProperty(value = "标签组ID",required = true)
    @NotBlank(message = "标签组ID不能为空")
    private String tagGroupId;

    @ApiModelProperty(value = "标签名称",required = true)
    @NotBlank(message = "标签名称不能为空")
    private String name;

}
