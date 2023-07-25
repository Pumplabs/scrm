package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrCommonConf;
import com.scrm.server.wx.cp.service.IBrCommonConfService;
import com.scrm.server.wx.cp.vo.BrCommonConfVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 通用配置 控制器
 * @author ouyang
 * @since 2022-06-07
 */
@RestController
@RequestMapping("/brCommonConf")
@Api(tags = {"通用配置"})
public class BrCommonConfController {

    @Autowired
    private IBrCommonConfService brCommonConfService;

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "通用配置", operatorType = "分页查询")
    public R<IPage<BrCommonConfVO>> pageList(@RequestBody @Valid BrCommonConfPageDTO dto){
        return R.data(brCommonConfService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "通用配置", operatorType = "查询列表")
    public R<List<BrCommonConfVO>> list(@RequestBody @Valid BrCommonConfQueryDTO dto){
        return R.data(brCommonConfService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "通用配置", operatorType = "根据主键查询")
    public R<BrCommonConfVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "通用配置ID不能为空");
        return R.data(brCommonConfService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "通用配置", operatorType = "新增")
    public R<BrCommonConf> save(@RequestBody @Valid BrCommonConfSaveDTO dto){
        return R.data(brCommonConfService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "通用配置", operatorType = "修改")
    public R<BrCommonConf> update(@RequestBody @Valid BrCommonConfUpdateDTO dto){
        return R.data(brCommonConfService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "通用配置", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "通用配置ID不能为空");
        brCommonConfService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "通用配置", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brCommonConfService.batchDelete(dto);
        return R.success("删除成功");
    }


    @PostMapping("/updateSort")
    @ApiOperation(value = "更新商机阶段排序")
    @Log(modelName = "更新商机阶段排序", operatorType = "更新商机阶段排序")
    public R<Void> updateSort(@RequestBody @Valid BrCommonConfUpdateSortDTO dto){
        brCommonConfService.updateSort(dto);
        return R.success("更新成功");
    }



}
