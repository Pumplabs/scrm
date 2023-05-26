package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.server.wx.cp.entity.BrGroupChatWelcome;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * @author xxh
 * @since 2022-04-24
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "入群欢迎语结果集")
public class BrGroupChatWelcomeVO extends BrGroupChatWelcome{

    @ApiModelProperty(value = "创建员工信息")
    private Staff creatorStaff;

    @ApiModelProperty(value = "群聊列表")
    private List<WxGroupChat> groupChatList;

}
