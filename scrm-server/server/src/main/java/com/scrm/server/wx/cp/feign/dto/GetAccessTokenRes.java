package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/1 17:09
 * @description：通过 code 换取 access_token的结果
 **/
@Data
@Accessors(chain = true)
public class GetAccessTokenRes extends MpErrorCode{

    private String access_token;

    private Integer expires_in;

    private String refresh_token;

    private String openid;

    private String scope;
}
