package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 20:17
 * @description：构造微信公众平台授权链接需要的信息
 **/
@ApiModel("构造微信公众平台授权链接需要的信息")
@Data
@Accessors(chain = true)
public class MpAuthDTO {

    private String preAuthCode;

    private String appId;
}
