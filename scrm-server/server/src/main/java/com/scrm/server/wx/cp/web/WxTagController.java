package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;import com.scrm.api.wx.cp.dto.WxTagDTO;
import com.scrm.server.wx.cp.service.IWxTagService;
import com.scrm.api.wx.cp.entity.WxTag;
import com.scrm.common.constant.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 企业微信标签管理 控制器
 * @author xxh
 * @since 2021-12-29
 */
@RestController
@RequestMapping("/wxTag")
@Api(tags = {"企业微信标签管理"})
public class WxTagController {

    @Autowired
    private IWxTagService wxTagService;


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "企业微信标签管理", operatorType = "新增")
    public R<WxTag> save(@RequestBody @Valid WxTagDTO dto) throws WxErrorException {
        return R.data(wxTagService.save(dto));
    }


}
