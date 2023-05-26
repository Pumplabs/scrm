package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxGroupChatTransferInfo;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "微信群聊-离职继承详情结果集")
public class WxGroupChatTransferInfoVO extends WxGroupChatTransferInfo{

    @ApiModelProperty(value = "群聊")
    private WxGroupChatVO groupChat;

    @ApiModelProperty(value = "原群主")
    private StaffVO handoverStaff;

    @ApiModelProperty(value = "新群主")
    private StaffVO takeoverStaff;
}
