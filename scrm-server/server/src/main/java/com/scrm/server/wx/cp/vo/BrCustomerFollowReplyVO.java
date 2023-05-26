package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrCustomerFollowReply;
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
@ApiModel(value = "客户跟进回复表结果集")
public class BrCustomerFollowReplyVO extends BrCustomerFollowReply{

    @ApiModelProperty("被回复的消息（如果是回复回复的话）")
    private BrCustomerFollowReply beReplyInfo;

    @ApiModelProperty("被回复那个人（如果是回复回复的话）")
    private Staff beReplyStaff;

    @ApiModelProperty("主动回复那个人")
    private Staff staff;
}
