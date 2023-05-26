package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 11:25
 * @description：获取预授权码的结果
 **/
@Data
public class PreAuthCodeRes extends  MpErrorCode {

    private String pre_auth_code;

    private Integer expires_in;

}
