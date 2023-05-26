package com.scrm.api.wx.cp.dto;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/7/13 20:16
 * @description：微信开放平台回调信息
 **/
@Data
public class MpCallBackDTO {
    
    @JSONField(name = "AppId")
    private String appId;

    @JSONField(name = "CreateTime")
    private Integer createTime;

    @JSONField(name = "InfoType")
    private String infoType;

    @JSONField(name = "AuthorizerAppid")
    private String authorizerAppid;

    @JSONField(name = "ComponentVerifyTicket")
    private String componentVerifyTicket;
}
