package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author xuxh
 * @date 2022/2/23 17:00
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊标签-批量打标")
public class WxGroupChatTagBatchMarkingDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "客户群聊extId列表", required = true)
    @NotNull(message = "客户群聊extId不能为空")
    @Size(min = 1, message = "客户群聊extId不能为空")
    private List<String> groupChatExtIds;

    @ApiModelProperty(value = "客户群聊标签id列表")
    private List<String> tagIds;


}
