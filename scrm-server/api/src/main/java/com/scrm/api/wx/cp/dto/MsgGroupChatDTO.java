package com.scrm.api.wx.cp.dto;

import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.vo.SimpleStaffVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/3 23:18
 * @description：微信群群发-群聊详情
 **/
@Data
@ApiModel("微信群群发-群聊详情")
public class MsgGroupChatDTO extends WxGroupChat{

    @ApiModelProperty("群主的信息都在里面了")
    private SimpleStaffVO ownerInfo;

    @ApiModelProperty("发送状态：0-未发送 1-已发送 -1->发送失败")
    private Integer sendStatus;
}
