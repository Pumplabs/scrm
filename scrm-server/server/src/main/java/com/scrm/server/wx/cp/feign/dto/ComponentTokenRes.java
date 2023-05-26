package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 16:52
 * @description：获取token的结果
 **/
@Data
public class ComponentTokenRes extends MpErrorCode{

    private String component_access_token;

    private Integer expires_in;

}
