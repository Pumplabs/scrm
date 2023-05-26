package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;

/**
 * @author xuxh
 * @date 2022/2/15 14:57
 */
@Data
public class WxCpXmlOutMessageDTO extends WxCpXmlMessage {

    @ApiModelProperty(value = "外部企业ID" )
    private String extCorpId;

    @ApiModelProperty("是否是新客户，任务宝那边的")
    private Boolean isNewCustomer;
}
