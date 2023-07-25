package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.common.annotation.PassToken;
import com.scrm.common.constant.R;
import com.scrm.server.wx.cp.service.ILoginService;
import com.scrm.api.wx.cp.vo.WxLoginParamsResVo;
import com.scrm.api.wx.cp.vo.WxStaffResVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/12 0:20
 * @description：扫码登录的接口
 **/
@RestController
@Api(tags = "扫码登录相关接口")
@RequestMapping("/staff-login")
public class LoginController {

    @Autowired
    private ILoginService loginService;

    @ApiOperation("自建应用获取登录链接接口")
    @Log(modelName = "自建应用获取登录链接接口", operatorType = "登录接口")
    @PassToken
    @PostMapping("/login")
    public R<WxLoginParamsResVo> login(){
        return R.data(loginService.login());
    }

    @ApiOperation("登录回调")
    @Log(modelName = "扫码登录相关接口", operatorType = "登录回调")
    @PassToken
    @GetMapping("/login-callback")
    @ResponseStatus(code= HttpStatus.FOUND)
    public R<Void> loginBack(String code, String state, String appid, HttpServletResponse response){
        loginService.loginBack(code, state, appid, response);
        return R.success();
    }

    @ApiOperation("根据state获取员工信息")
    @Log(modelName = "扫码登录相关接口", operatorType = "根据state获取员工信息")
    @PassToken
    @GetMapping("/getStaffByState")
    public R<WxStaffResVo> getStaffByState(@RequestParam String state){
        return R.data(loginService.getStaffByState(state));
    }

    @ApiOperation("获取登录员工的信息")
    @Log(modelName = "扫码登录相关接口", operatorType = "获取登录员工的信息")
    @GetMapping("/getCurrentStaff")
    public R<WxStaffResVo> getCurrentStaff(){
        return R.data(loginService.getCurrentStaff());
    }

    @ApiOperation("根据code获取员工信息")
    @Log(modelName = "扫码登录相关接口", operatorType = "根据code获取员工信息")
    @PassToken
    @GetMapping("/getStaffByCode")
    public R<WxStaffResVo> getStaffByCode(@RequestParam String code){
        return R.data(loginService.getStaffByCode(code));
    }

    @GetMapping("/getLoginUrl")
    @PassToken
    @ApiOperation("获取登录的url")
    @Log(modelName = "扫码登录相关接口", operatorType = "获取登录的url")
    public R<String> getLoginUrl(){
        return R.data(loginService.getLoginUrl());
    }

    @GetMapping("/loginByAuthCode")
    @PassToken
    @ApiOperation("根据授权码登录")
    @Log(modelName = "扫码登录相关接口", operatorType = "根据授权码登录")
    public R<WxStaffResVo> loginByAuthCode(@RequestParam String authCode){
        return R.data(loginService.loginByAuthCode(authCode));
    }

    @ApiOperation("(v2)自建应用根据code获取员工信息")
    @Log(modelName = "扫码登录相关接口", operatorType = "根据code获取员工信息")
    @PassToken
    @GetMapping("/v2/getStaffByCode")
    public R<WxStaffResVo> getStaffByCodeV2(@RequestParam String code,@RequestParam(required = false) String loginFromWeb){
        boolean isLoginFromWeb = loginFromWeb == null ? false:true;
        return R.data(loginService.getStaffByCodeV2(code,isLoginFromWeb));
    }
}
