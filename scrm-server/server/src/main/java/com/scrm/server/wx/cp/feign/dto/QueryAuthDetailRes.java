package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/1 15:07
 * @description：
 **/
@Data
@Accessors(chain = true)
public class QueryAuthDetailRes {

    private String authorizer_appid;

    private String authorizer_access_token;

    private String authorizer_refresh_token;

    private Integer expires_in;

    private Object func_info;

}
