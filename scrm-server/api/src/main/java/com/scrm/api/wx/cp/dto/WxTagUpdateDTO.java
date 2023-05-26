package com.scrm.api.wx.cp.dto;


import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author xxh
 * @since 2021-12-29
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信标签管理修改请求参数")
public class WxTagUpdateDTO {

    @ApiModelProperty(value = "'ID'")
    private String id;

    @ApiModelProperty(value = "标签名称")
    private String name;

    @ApiModelProperty(value = "标签排序值，值大的在前")
    private Long order;

}
