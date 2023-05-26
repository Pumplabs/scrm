package com.scrm.server.wx.cp.web;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.IBrCustomerDynamicService;
import com.scrm.server.wx.cp.entity.BrCustomerDynamic;

import com.scrm.server.wx.cp.dto.BrCustomerDynamicPageDTO;
import com.scrm.server.wx.cp.dto.BrCustomerDynamicSaveDTO;
import com.scrm.server.wx.cp.dto.BrCustomerDynamicUpdateDTO;

import com.scrm.server.wx.cp.dto.BrCustomerDynamicQueryDTO;
import com.scrm.server.wx.cp.vo.BrCustomerDynamicVO;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;
import java.util.List;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.scrm.api.wx.cp.dto.*;

import javax.validation.Valid;

/**
 * 客户动态 控制器
 * @author xxh
 * @since 2022-05-12
 */
@RestController
@RequestMapping("/brCustomerDynamic")
@Api(tags = {"客户动态"})
public class BrCustomerDynamicController {

    @Autowired
    private IBrCustomerDynamicService brCustomerDynamicService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "客户动态", operatorType = "分页查询")
    public R<IPage<BrCustomerDynamicVO>> pageList(@RequestBody @Valid BrCustomerDynamicPageDTO dto){
        return R.data(brCustomerDynamicService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "客户动态", operatorType = "查询列表")
    public R<List<BrCustomerDynamicVO>> list(@RequestBody @Valid BrCustomerDynamicQueryDTO dto){
        return R.data(brCustomerDynamicService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "客户动态", operatorType = "根据主键查询")
    public R<BrCustomerDynamicVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户动态ID不能为空");
        return R.data(brCustomerDynamicService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "客户动态", operatorType = "新增")
    public R<BrCustomerDynamic> save(@RequestBody @Valid BrCustomerDynamicSaveDTO dto){
        return R.data(brCustomerDynamicService.save(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "客户动态", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户动态ID不能为空");
        brCustomerDynamicService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "客户动态", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brCustomerDynamicService.batchDelete(dto);
        return R.success("删除成功");
    }

}
