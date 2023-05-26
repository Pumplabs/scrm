package com.scrm.server.wx.cp.web;

import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.R;
import com.scrm.server.wx.cp.service.IMpAuthService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/17 14:32
 * @description：微信公众号授权接口
 **/
@RestController
@RequestMapping("/mp/auth")
@Api(tags = {"微信公众号授权接口"})
@Valid
public class MpAuthController {

    @Autowired
    private IMpAuthService mpAuthService;

    @Autowired
    private IWxCustomerService customerService;

    @GetMapping("/getUnionIdByCode")
    @ApiOperation("根据授权code查询unionId")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "授权code", name = "code", required = true)
    })
    public R<String> getUnionIdByCode(@RequestParam String code){
        return R.data(mpAuthService.getUnionIdByCode(code, ScrmConfig.getExtCorpID()));
    }


    @GetMapping("/getAppIdIdByCorpId")
    @ApiOperation("根据授权CorpId查询AppIdId")
    public R<String> getAppIdIdByCorpId(){
        return R.data(mpAuthService.getAppIdIdByCorpId(ScrmConfig.getExtCorpID()));
    }

    @GetMapping("/getCustomerByCode")
    @ApiOperation("根据授权code查询客户信息")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "授权code", name = "code", required = true)
    })
    public R<WxCustomer> getCustomerByCode(@RequestParam String code){
        return R.data(mpAuthService.getCustomerByCode(code, ScrmConfig.getExtCorpID()));
    }
}
