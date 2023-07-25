package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.vo.WxLoginParamsResVo;
import com.scrm.api.wx.cp.vo.WxStaffResVo;

import javax.servlet.http.HttpServletResponse;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/12 0:26
 * @description：
 **/
public interface ILoginService {

    /**
     * 构造微信扫码登录需要的参数给前端
     * @return
     */
    WxLoginParamsResVo login();

    /**
     * 给微信回调的回调函数
     * @param code
     * @param state
     * @param appid
     * @param response
     */
    void loginBack(String code, String state, String appid, HttpServletResponse response);

    /**
     * 获取登录员工的信息
     * @return
     */
    WxStaffResVo getCurrentStaff();

    /**
     * 登录成功根据state拿员工信息和token
     * @param state
     * @return
     */
    WxStaffResVo getStaffByState(String state);

    /**
     * 根据code拿用户信息
     * @param code
     * @return
     */
    WxStaffResVo getStaffByCode(String code);

    /**
     * 获取登录的url
     * @return
     */
    String getLoginUrl();

    /**
     * 根据授权码登录
     * @param authCode
     * @return
     */
    WxStaffResVo loginByAuthCode(String authCode);

    /**
     * v2登录接口（自建应用）
     * @param code
     * @return
     */
    WxStaffResVo getStaffByCodeV2(String code,boolean isLoginFromWeb);
}
