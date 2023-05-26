package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@ApiModel("js签名数据")
@Accessors(chain = true)
public class JsSignatureDTO {

    private String nonceStr;

    private Long timestamp;

    private String signature;

    private Integer agentId;
}
