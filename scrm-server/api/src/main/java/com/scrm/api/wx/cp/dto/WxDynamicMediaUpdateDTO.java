package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-03-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户查看素材的动态修改请求参数")
public class WxDynamicMediaUpdateDTO {

    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "企业id")
    private String corpId;

    @ApiModelProperty(value = "查看时长")
    private Integer time;


}
