package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-02-22
 */
@Data
@ApiModel(value = "客户群聊标签分页请求参数")
@Accessors(chain = true)
public class WxGroupChatTagPageDTO extends BasePageDTO {


    @ApiModelProperty(value = "群聊标签组ID")
    private String groupChatTagGroupId;

    @ApiModelProperty(value = "群聊标签名称")
    private String name;

}

