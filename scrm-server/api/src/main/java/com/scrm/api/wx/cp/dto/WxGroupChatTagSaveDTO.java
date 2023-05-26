package com.scrm.api.wx.cp.dto;


import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-02-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊标签新增DTO")
public class WxGroupChatTagSaveDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "群聊标签组ID", required = true)
    @NotBlank(message = "群聊标签组ID不能为空")
    private String groupChatTagGroupId;

    @ApiModelProperty(value = "群聊标签名称", required = true)
    @NotBlank(message = "群聊标签名称不能为空")
    private String name;

}
