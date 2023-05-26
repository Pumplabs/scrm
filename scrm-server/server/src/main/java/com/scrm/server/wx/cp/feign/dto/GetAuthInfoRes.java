package com.scrm.server.wx.cp.feign.dto;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/21 17:05
 * @description：获取授权信息结果
 **/
@Data
public class GetAuthInfoRes extends MpErrorCode{

    private JSONObject dealer_corp_info;

    private AuthCorpInfo auth_corp_info;

    private AuthInfo auth_info;

}
