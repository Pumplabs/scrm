package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;

import com.scrm.server.wx.cp.service.IWxTagGroupService;
import com.scrm.api.wx.cp.entity.WxTagGroup;

import com.scrm.api.wx.cp.dto.WxTagGroupPageDTO;
import com.scrm.api.wx.cp.dto.WxTagGroupSaveDTO;
import com.scrm.api.wx.cp.dto.WxTagGroupUpdateDTO;

import com.scrm.api.wx.cp.dto.WxTagGroupQueryDTO;
import com.scrm.api.wx.cp.vo.WxTagGroupVO;


import com.scrm.common.constant.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.Assert;

import javax.validation.Valid;
import java.util.List;

/**
 * 企业微信标签组管理 控制器
 * @author xxh
 * @since 2021-12-29
 */
@RestController
@RequestMapping("/wxTagGroup")
@Api(tags = {"企业微信标签组管理"})
public class WxTagGroupController {

    @Autowired
    private IWxTagGroupService wxTagGroupService;

    @GetMapping("/sync")
    @ApiOperation(value = "同步企业微信数据")
    @Log(modelName = "企业微信标签组管理", operatorType = "同步企业微信数据")
    @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true)
    public R<Boolean> pageList(String extCorpId) throws WxErrorException {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        return R.data(wxTagGroupService.sync(extCorpId));
    }

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "企业微信标签组管理", operatorType = "分页查询")
    public R<IPage<WxTagGroupVO>> pageList(@RequestBody WxTagGroupPageDTO dto){
        return R.data(wxTagGroupService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "企业微信标签组管理", operatorType = "查询列表")
    public R<List<WxTagGroupVO>> list(@RequestBody WxTagGroupQueryDTO dto){
        return R.data(wxTagGroupService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "企业微信标签组管理", operatorType = "根据主键查询")
    public R<WxTagGroup> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "企业微信标签组管理ID不能为空");
        return R.data(wxTagGroupService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "企业微信标签组管理", operatorType = "新增")
    public R<WxTagGroupVO> save(@RequestBody @Valid WxTagGroupSaveDTO dto) throws WxErrorException {
        return R.data(wxTagGroupService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "企业微信标签组管理", operatorType = "修改")
    public R<WxTagGroup> update(@RequestBody @Valid WxTagGroupUpdateDTO dto) throws WxErrorException {
        return R.data(wxTagGroupService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "企业微信标签组管理", operatorType = "删除")
    public R<Void> delete(String id) throws WxErrorException {
        Assert.isTrue(StringUtils.isNotBlank(id), "企业微信标签组管理ID不能为空");
        wxTagGroupService.delete(id);
        return R.success("删除成功");
    }


}
