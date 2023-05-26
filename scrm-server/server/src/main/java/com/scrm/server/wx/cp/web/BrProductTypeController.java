package com.scrm.server.wx.cp.web;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.IBrProductTypeService;
import com.scrm.server.wx.cp.entity.BrProductType;

import com.scrm.server.wx.cp.dto.BrProductTypePageDTO;
import com.scrm.server.wx.cp.dto.BrProductTypeSaveDTO;
import com.scrm.server.wx.cp.dto.BrProductTypeUpdateDTO;

import com.scrm.server.wx.cp.dto.BrProductTypeQueryDTO;
import com.scrm.server.wx.cp.vo.BrProductTypeVO;

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
 * 产品分类 控制器
 * @author xxh
 * @since 2022-07-17
 */
@RestController
@RequestMapping("/brProductType")
@Api(tags = {"产品分类"})
public class BrProductTypeController {

    @Autowired
    private IBrProductTypeService brProductTypeService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "产品分类", operatorType = "分页查询")
    public R<IPage<BrProductTypeVO>> pageList(@RequestBody @Valid BrProductTypePageDTO dto){
        return R.data(brProductTypeService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "产品分类", operatorType = "查询列表")
    public R<List<BrProductTypeVO>> list(@RequestBody @Valid BrProductTypeQueryDTO dto){
        return R.data(brProductTypeService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "产品分类", operatorType = "根据主键查询")
    public R<BrProductTypeVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "产品分类ID不能为空");
        return R.data(brProductTypeService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "产品分类", operatorType = "新增")
    public R<BrProductType> save(@RequestBody @Valid BrProductTypeSaveDTO dto){
        return R.data(brProductTypeService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "产品分类", operatorType = "修改")
    public R<BrProductType> update(@RequestBody @Valid BrProductTypeUpdateDTO dto){
        return R.data(brProductTypeService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "产品分类", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "产品分类ID不能为空");
        brProductTypeService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "产品分类", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brProductTypeService.batchDelete(dto);
        return R.success("删除成功");
    }

}
