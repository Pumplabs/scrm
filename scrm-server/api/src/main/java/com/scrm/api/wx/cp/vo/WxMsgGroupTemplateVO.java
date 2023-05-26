package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.entity.WxMsgGroupTemplate;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2022-03-02
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊-群发消息结果集")
public class WxMsgGroupTemplateVO extends WxMsgGroupTemplate {

    @ApiModelProperty("创建者信息")
    private Staff creatorInfo;

    @ApiModelProperty("未发送群主人数")
    private Integer noSendStaffCount = 0;

    @ApiModelProperty("已发送群主人数")
    private Integer sendStaffCount = 0;

    @ApiModelProperty("未送达群聊数")
    private Integer noSendChatCount = 0;

    @ApiModelProperty("已送达群聊数")
    private Integer sendChatCount = 0;

    @ApiModelProperty("群发的群聊名")
    private List<WxGroupChat> chatNames;
}
