package com.scrm.server.wx.cp.web;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.service.IBrFieldLogService;
import com.scrm.server.wx.cp.service.IBrOpportunityService;
import com.scrm.server.wx.cp.entity.BrOpportunity;

import com.scrm.server.wx.cp.vo.BrFieldLogVO;
import com.scrm.server.wx.cp.vo.BrOpportunityVO;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 商机 控制器
 * @author ouyang
 * @since 2022-06-07
 */
@RestController
@RequestMapping("/brOpportunity")
@Api(tags = {"商机"})
public class BrOpportunityController {

    @Autowired
    private IBrOpportunityService brOpportunityService;

    @Autowired
    private IBrFieldLogService fieldLogService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "商机", operatorType = "分页查询")
    public R<IPage<BrOpportunityVO>> pageList(@RequestBody @Valid BrOpportunityPageDTO dto){
        return R.data(brOpportunityService.pageList(dto));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "商机", operatorType = "根据主键查询")
    public R<BrOpportunityVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "商机ID不能为空");
        return R.data(brOpportunityService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "商机", operatorType = "新增")
    public R<BrOpportunity> save(@RequestBody @Valid BrOpportunitySaveDTO dto){
        return R.data(brOpportunityService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "商机", operatorType = "修改")
    public R<BrOpportunity> update(@RequestBody @Valid BrOpportunityUpdateDTO dto){
        return R.data(brOpportunityService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "商机", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "商机ID不能为空");
        brOpportunityService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "商机", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brOpportunityService.batchDelete(dto);
        return R.success("删除成功");
    }


    @PostMapping(value = "/updateStage")
    @ApiOperation(value = "修改阶段")
    @Log(modelName = "商机", operatorType = "修改阶段")
    public R<Void> updateStage(@RequestBody @Valid BrOpportunityUpdateStageDTO dto){
        brOpportunityService.updateStage(dto);
        return R.success("修改成功");
    }

    @PostMapping("/logList")
    @ApiOperation(value = "分页查询更新动态")
    @Log(modelName = "商机", operatorType = "分页查询更新动态")
    public R<IPage<BrFieldLogVO>> logList(@RequestBody @Valid BrFieldLogPageDTO dto){
        return R.data(fieldLogService.pageList(dto));
    }

}
