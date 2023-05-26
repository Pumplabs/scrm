package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-05-19
 */
@Data
@ApiModel(value = "客户跟进回复表条件查询请求参数")
@Accessors(chain = true)
public class BrCustomerFollowReplyQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("跟进id")
    @NotBlank(message = "跟进id不能为空")
    private String followId;
}
