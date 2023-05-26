package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 11:25
 * @description：获取预授权码的参数
 **/
@Data
@Accessors(chain = true)
public class PreAuthCodeParams {

    private String component_appid;

}
