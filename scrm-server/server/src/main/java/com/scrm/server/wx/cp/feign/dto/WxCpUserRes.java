package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import me.chanjar.weixin.cp.bean.Gender;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/21 15:51
 * @description：
 **/
@Data
public class WxCpUserRes extends MpErrorCode{

    private String name;
    private String mobile;
    private Gender gender;
    private String email;
    private String avatar;
    private Integer status;
    private String alias;
    private String telephone;
    private String qrCode;
    private String externalPosition;
    private String address;

}
