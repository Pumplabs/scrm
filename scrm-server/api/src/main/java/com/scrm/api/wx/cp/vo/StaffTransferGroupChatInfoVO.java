package com.scrm.api.wx.cp.vo;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@ApiModel(value = "离职客户群转移详情信息VO")
public class StaffTransferGroupChatInfoVO {

    @ApiModelProperty(value = "企业群聊extId")
    private String groupChatExtId;

    @ApiModelProperty(value = "名称")
    private String groupChatName;

    @ApiModelProperty(value = "微信错误code")
    private long errCode;

    @ApiModelProperty(value = "微信错误原因")
    private String errMsg;
}
