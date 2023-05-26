package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.IWxGroupChatTagGroupService;
import com.scrm.api.wx.cp.entity.WxGroupChatTagGroup;

import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupPageDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupSaveDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupUpdateDTO;

import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupQueryDTO;
import com.scrm.api.wx.cp.vo.WxGroupChatTagGroupVO;


import com.scrm.common.constant.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.Assert;

import javax.validation.Valid;
import java.io.*;
import java.util.Arrays;
import java.util.List;

/**
 * 客户群聊标签组 控制器
 *
 * @author xxh
 * @since 2022-02-22
 */
@RestController
@RequestMapping("/wxGroupChatTagGroup")
@Api(tags = {"客户群聊标签组"})
public class WxGroupChatTagGroupController {
 
   

    @Autowired
    private IWxGroupChatTagGroupService wxGroupChatTagGroupService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "客户群聊标签组", operatorType = "分页查询")
    public R<IPage<WxGroupChatTagGroupVO>> pageList(@RequestBody WxGroupChatTagGroupPageDTO dto) {
        return R.data(wxGroupChatTagGroupService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "客户群聊标签组", operatorType = "查询列表")
    public R<List<WxGroupChatTagGroupVO>> list(@RequestBody WxGroupChatTagGroupQueryDTO dto) {
        return R.data(wxGroupChatTagGroupService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "客户群聊标签组", operatorType = "根据主键查询")
    public R<WxGroupChatTagGroup> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群聊标签组ID不能为空");
        return R.data(wxGroupChatTagGroupService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "客户群聊标签组", operatorType = "新增")
    public R<WxGroupChatTagGroup> save(@RequestBody @Valid WxGroupChatTagGroupSaveDTO dto) {
        return R.data(wxGroupChatTagGroupService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "客户群聊标签组", operatorType = "修改")
    public R<WxGroupChatTagGroup> update(@RequestBody @Valid WxGroupChatTagGroupUpdateDTO dto) {
        return R.data(wxGroupChatTagGroupService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "客户群聊标签组", operatorType = "删除")
    public R<Void> delete(String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群聊标签组ID不能为空");
        wxGroupChatTagGroupService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "客户群聊标签组", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto) {
        wxGroupChatTagGroupService.batchDelete(dto);
        return R.success("删除成功");
    }

}
