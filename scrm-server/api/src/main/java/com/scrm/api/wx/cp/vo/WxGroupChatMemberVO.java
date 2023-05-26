package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxGroupChatMember;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-01-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊成员结果集")
public class WxGroupChatMemberVO extends WxGroupChatMember{

    @ApiModelProperty(value = "成员名称")
    private String memberName;

    @ApiModelProperty(value = "员工ID")
    private String staffId;

    @ApiModelProperty(value = "员工")
    private Staff staff;

    @ApiModelProperty(value = "客户企业名称")
    private String memberExtCorpName;

    @ApiModelProperty(value = "成员头像地址")
    private String memberAvatarUrl;

    @ApiModelProperty(value = "邀请员工")
    private String invitorName;


}
