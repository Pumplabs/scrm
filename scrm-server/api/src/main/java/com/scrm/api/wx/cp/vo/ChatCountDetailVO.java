package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxGroupChat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

/**
 * @author ：ouyang
 * @date ：Created in 2022/5/24 15:35
 * @description：群活码统计结果详情VO
 **/
@Data
@ApiModel("群活码统计结果详情VO")
@Accessors(chain = true)
public class ChatCountDetailVO {

    @ApiModelProperty(value = "总人数")
    private long totalMemberNum = 0;

    @ApiModelProperty(value = "添加人数")
    private long joinMemberNum = 0;

    @ApiModelProperty(value = "流失人数")
    private long quitMemberNum = 0;

    @ApiModelProperty(value = "群聊")
    private WxGroupChat chat;

    @ApiModelProperty(value = "创建时间")
    private Date createTime;
}
