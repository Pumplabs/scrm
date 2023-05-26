package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/1 15:11
 * @description：
 **/
@Data
@Accessors(chain = true)
public class GetAuthorizerInfoDetailRes {

    private String nick_name;

    private String head_img;

    private String principal_name;

    private String alias;

    private String user_name;

    private String qrcode_url;

    private Object service_type_info;

    private Object verify_type_info;

    private Object business_info;

    private Integer account_status;

    //下面是小程序的
    private Integer idc;

    private String signature;

    private Object MiniProgramInfo;
}
