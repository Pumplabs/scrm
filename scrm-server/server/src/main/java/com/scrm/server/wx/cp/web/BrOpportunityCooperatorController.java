package com.scrm.server.wx.cp.web;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.IBrOpportunityCooperatorService;
import com.scrm.server.wx.cp.entity.BrOpportunityCooperator;

import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorPageDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorSaveDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorUpdateDTO;

import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorQueryDTO;
import com.scrm.server.wx.cp.vo.BrOpportunityCooperatorVO;

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
 * 商机-协作人关联 控制器
 * @author ouyang
 * @since 2022-06-07
 */
@RestController
@RequestMapping("/brOpportunityCooperator")
@Api(tags = {"商机-协作人关联"})
public class BrOpportunityCooperatorController {

    @Autowired
    private IBrOpportunityCooperatorService brOpportunityCooperatorService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "商机-协作人关联", operatorType = "分页查询")
    public R<IPage<BrOpportunityCooperatorVO>> pageList(@RequestBody @Valid BrOpportunityCooperatorPageDTO dto){
        return R.data(brOpportunityCooperatorService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "商机-协作人关联", operatorType = "查询列表")
    public R<List<BrOpportunityCooperatorVO>> list(@RequestBody @Valid BrOpportunityCooperatorQueryDTO dto){
        return R.data(brOpportunityCooperatorService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "商机-协作人关联", operatorType = "根据主键查询")
    public R<BrOpportunityCooperatorVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "商机-协作人关联ID不能为空");
        return R.data(brOpportunityCooperatorService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "商机-协作人关联", operatorType = "新增")
    public R<BrOpportunityCooperator> save(@RequestBody @Valid BrOpportunityCooperatorSaveDTO dto){
        return R.data(brOpportunityCooperatorService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "商机-协作人关联", operatorType = "修改")
    public R<BrOpportunityCooperator> update(@RequestBody @Valid BrOpportunityCooperatorUpdateDTO dto){
        return R.data(brOpportunityCooperatorService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "商机-协作人关联", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "商机-协作人关联ID不能为空");
        brOpportunityCooperatorService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "商机-协作人关联", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brOpportunityCooperatorService.batchDelete(dto);
        return R.success("删除成功");
    }

}
