package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/21 17:05
 * @description：获取授权信息参数
 **/
@Data
@Accessors(chain = true)
public class GetAuthInfoParams {

    private String auth_corpid;

    private String permanent_code;

}
