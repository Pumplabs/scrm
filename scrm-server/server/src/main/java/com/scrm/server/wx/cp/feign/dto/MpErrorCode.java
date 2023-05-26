package com.scrm.server.wx.cp.feign.dto;

import com.alibaba.fastjson.JSON;
import com.scrm.common.exception.BaseException;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 11:22
 * @description：微信错误码
 **/
@Data
@Slf4j
public class MpErrorCode {

    private Integer errcode;

    private String errmsg;

    /**
     * 检查微信公众平台的请求结果
     */
    public void checkNoNull() {
        if (errcode != null) {
            log.error("微信公众平台请求失败，[{}]", JSON.toJSONString(errcode));
            throw new BaseException(errmsg);
        }
    }

    /**
     * 检查企业微信的请求结果
     */
    public void checkNoZero() {
        if (errcode != null && errcode != 0) {
            log.error("企业微信请求失败，[{}]", JSON.toJSONString(errcode));
            throw new BaseException(errmsg);
        }
    }
}