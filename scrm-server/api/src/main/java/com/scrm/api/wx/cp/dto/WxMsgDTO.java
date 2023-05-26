package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/1/16 1:31
 * @description：微信给客户发消息，前端传过来的DTO
 **/
@Data
@ApiModel("微信给客户发消息，前端传过来的DTO")
public class WxMsgDTO {

    @ApiModelProperty("文本信息")
    private List<WxMsgTextDTO> text;

    @ApiModelProperty("附件信息")
    private List<WxMsgAttachmentDTO> media;

}
