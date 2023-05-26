package com.scrm.api.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-03-22
 */
@Data
@ApiModel(value = "渠道码，过期时间表条件查询请求参数")
@Accessors(chain = true)
public class WxContactExpirationQueryDTO {

    @ApiModelProperty("企业id")
    @NotNull(message = "企业id不能为空")
    private String extCorpId;

}
