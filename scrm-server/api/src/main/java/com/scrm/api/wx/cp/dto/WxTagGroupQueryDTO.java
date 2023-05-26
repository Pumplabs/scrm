package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2021-12-29
 */
@Data
@ApiModel(value = "企业微信标签组管理条件查询请求参数")
@Accessors(chain = true)
public class WxTagGroupQueryDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

}
