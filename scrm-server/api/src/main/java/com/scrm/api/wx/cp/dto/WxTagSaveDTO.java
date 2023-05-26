package com.scrm.api.wx.cp.dto;


import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;


/**
 * @author xxh
 * @since 2021-12-29
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信标签管理新增DTO")
public class WxTagSaveDTO {

    @ApiModelProperty(value = "标签名称",required = true)
    @Valid
    @NotBlank(message = "标签名称不能为空")
    private String name;

    @ApiModelProperty(value = "标签排序值，值大的在前",required = true)
    @NotBlank(message = "标签排序值不能为空")
    @Valid
    private Long order;

}
