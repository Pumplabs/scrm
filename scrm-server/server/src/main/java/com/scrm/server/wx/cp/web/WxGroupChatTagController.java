package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;

import com.scrm.api.wx.cp.dto.WxGroupChatTagBatchMarkingDTO;
import com.scrm.server.wx.cp.service.IWxGroupChatTagService;
import com.scrm.api.wx.cp.entity.WxGroupChatTag;

import com.scrm.api.wx.cp.dto.WxGroupChatTagSaveDTO;


import com.scrm.common.constant.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 客户群聊标签 控制器
 * @author xxh
 * @since 2022-02-22
 */
@RestController
@RequestMapping("/wxGroupChatTag")
@Api(tags = {"客户群聊标签"})
public class WxGroupChatTagController {

    @Autowired
    private IWxGroupChatTagService wxGroupChatTagService;


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "客户群聊标签", operatorType = "新增")
    public R<WxGroupChatTag> save(@RequestBody @Valid WxGroupChatTagSaveDTO dto){
        return R.data(wxGroupChatTagService.save(dto));
    }


    @PostMapping(value = "/batchMarking")
    @ApiOperation(value = "批量打标")
    @Log(modelName = "客户群聊标签", operatorType = "批量打标")
    public R<Void> batchMarking(@RequestBody @Valid WxGroupChatTagBatchMarkingDTO dto){
        wxGroupChatTagService.batchMarking(dto);
        return R.success();
    }
}
