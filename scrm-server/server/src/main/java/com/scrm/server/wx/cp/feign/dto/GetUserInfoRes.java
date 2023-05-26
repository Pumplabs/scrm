package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/10/23 21:10
 * @description：
 **/
@Data
@Accessors(chain = true)
public class GetUserInfoRes extends MpErrorCode{
    
    private String userid;
    
    private String openid;
    
}
