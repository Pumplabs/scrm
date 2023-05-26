package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 16:52
 * @description：获取token的参数
 **/
@Data
@Accessors(chain = true)
public class ComponentTokenParams {

    private String component_appid;

    private String component_appsecret;

    private String component_verify_ticket;
}
