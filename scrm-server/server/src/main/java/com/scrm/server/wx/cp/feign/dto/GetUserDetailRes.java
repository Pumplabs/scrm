package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;


@Data
@Accessors(chain = true)
public class GetUserDetailRes extends MpErrorCode{
    
    private String userid;
    
    private String gender;

    private  String  avatar;

    private  String  qr_code;

    private  String  mobile;

    private  String  email;

    private  String  biz_mail;

    private  String  address;

    
}
