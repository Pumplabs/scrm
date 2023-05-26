package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.api.wx.cp.dto.MpAppIdDTO;
import com.scrm.common.annotation.PassToken;
import com.scrm.common.constant.R;
import com.scrm.common.exception.BaseException;
import com.scrm.server.wx.cp.entity.BrMpAccredit;
import com.scrm.server.wx.cp.service.IBrMpAccreditService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 微信第三方平台授权信息 控制器
 * @author xxh
 * @since 2022-04-30
 */
@RestController
@RequestMapping("/brMpAccredit")
@Api(tags = {"微信第三方平台授权信息"})
public class BrMpAccreditController {

    @Autowired
    private IBrMpAccreditService mpAccreditService;

    @GetMapping("/getMpAccreditList")
    @ApiOperation("获取授权的公众号信息列表")
    @Log(modelName = "微信第三方平台授权信息", operatorType = "获取授权的公众号信息列表")
    public R<List<BrMpAccredit>> getMpAccreditList(String extCorpId){
        if (StringUtils.isBlank(extCorpId)) {
            throw new BaseException("缺失企业参数！");
        }
        return R.data(mpAccreditService.getMpAccreditList(extCorpId));
    }

    @GetMapping("/getAppInfo")
    @PassToken
    @ApiOperation("获取appId")
    @Log(modelName = "微信第三方平台授权信息", operatorType = "获取appId")
    public R<MpAppIdDTO> getAppInfo(String extCorpId){
        return R.data(mpAccreditService.getAppInfo(extCorpId));
    }

    @GetMapping("/getAppInfoPrivate")
    @PassToken
    @ApiOperation("获取appId")
    @Log(modelName = "微信第三方平台授权信息", operatorType = "获取appId")
    public R<MpAppIdDTO> getAppInfoPrivate(String extCorpId){
        return R.data(mpAccreditService.getAppInfoPrivate(extCorpId));
    }
}
