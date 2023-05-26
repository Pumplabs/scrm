package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/1/16 1:33
 * @description：微信发消息给客户的文本信息
 **/
@Data
@ApiModel("微信发消息给客户的文本信息")
public class WxMsgTextDTO {

    @ApiModelProperty(" //文本类型 1,昵称变量，2： 普通文本")
    private Integer type;

    @ApiModelProperty("文本内容（非必填）")
    private String content;

    //文本类型是昵称变量
    public static final int NAME = 1;
}
