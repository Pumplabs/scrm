package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-02-22
 */
@Data
@ApiModel(value = "客户群聊标签组条件查询请求参数")
@Accessors(chain = true)
public class WxGroupChatTagGroupQueryDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "群聊标签组/标签名称")
    private String keyword;

}
