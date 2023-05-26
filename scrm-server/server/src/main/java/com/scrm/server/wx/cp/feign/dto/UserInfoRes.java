package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/1 17:38
 * @description：
 **/
@Data
public class UserInfoRes {

    private String openid;

    private String nickname;

    private String sex;

    private String province;

    private String city;

    private String country;

    private String headimgurl;

    private List<String> privilege;

    private String unionid;

}
