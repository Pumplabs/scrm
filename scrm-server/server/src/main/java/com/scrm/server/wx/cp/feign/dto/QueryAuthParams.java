package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/30 21:28
 * @description：查询授权信息、
 **/
@Data
@Accessors(chain = true)
public class QueryAuthParams {

    private String component_appid;

    private String authorization_code;
}
