package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrCustomerFollowMsg;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author xxh
 * @since 2022-05-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户跟进的消息结果集")
public class BrCustomerFollowMsgVO extends BrCustomerFollowMsg{

    @ApiModelProperty("跟进信息")
    private BrCustomerFollowVO brCustomerFollow;

    @ApiModelProperty("回复信息")
    private BrCustomerFollowReplyVO brCustomerFollowReply;
}
