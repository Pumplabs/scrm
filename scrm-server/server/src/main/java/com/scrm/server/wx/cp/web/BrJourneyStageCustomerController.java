package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.service.IBrJourneyStageCustomerService;
import com.scrm.server.wx.cp.entity.BrJourneyStageCustomer;

import com.scrm.server.wx.cp.vo.BrJourneyStageCustomerVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import io.swagger.annotations.ApiImplicitParams;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;

import java.util.List;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 旅程阶段-客户关联 控制器
 *
 * @author xxh
 * @since 2022-04-06
 */
@RestController
@RequestMapping("/brJourneyStageCustomer")
@Api(tags = {"旅程阶段-客户"})
public class BrJourneyStageCustomerController {

    @Autowired
    private IBrJourneyStageCustomerService brJourneyStageCustomerService;

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "旅程阶段-客户", operatorType = "分页查询")
    public R<IPage<BrJourneyStageCustomerVO>> pageList(@RequestBody @Valid BrJourneyStageCustomerPageDTO dto) {
        return R.data(brJourneyStageCustomerService.pageList(dto));
    }

    @PostMapping("/pageCustomerList")
    @ApiOperation(value = "获取客户分页列表")
    @Log(modelName = "旅程阶段-客户", operatorType = "获取客户分页列表")
    public R<IPage<WxCustomerVO>> pageCustomerList(@RequestBody @Valid BrJourneyCustomerPageDTO dto) {
        return R.data(brJourneyStageCustomerService.pageCustomerList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "旅程阶段-客户", operatorType = "查询列表")
    public R<List<BrJourneyStageCustomerVO>> list(@RequestBody @Valid BrJourneyStageCustomerQueryDTO dto) {
        return R.data(brJourneyStageCustomerService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "旅程阶段-客户", operatorType = "根据主键查询")
    public R<BrJourneyStageCustomerVO> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "旅程阶段-客户关联ID不能为空");
        return R.data(brJourneyStageCustomerService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "旅程阶段-客户", operatorType = "新增")
    public R<BrJourneyStageCustomer> save(@RequestBody @Valid BrJourneyStageCustomerSaveDTO dto) {
        return R.data(brJourneyStageCustomerService.save(dto));
    }

    @PostMapping(value = "/batchSave")
    @ApiOperation(value = "批量新增")
    @Log(modelName = "旅程阶段-客户", operatorType = "批量新增")
    public R<List<BrJourneyStageCustomer>> batchSave(@RequestBody @Valid BrJourneyStageCustomerBatchSaveDTO dto) {
        return R.data(brJourneyStageCustomerService.batchSave(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "旅程阶段-客户", operatorType = "修改")
    public R<BrJourneyStageCustomer> update(@RequestBody @Valid BrJourneyStageCustomerUpdateDTO dto) {
        return R.data(brJourneyStageCustomerService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "旅程阶段-客户", operatorType = "删除")
    public R<Void> delete(String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "旅程阶段-客户关联ID不能为空");
        brJourneyStageCustomerService.delete(id);
        return R.success("删除成功");
    }

    @GetMapping("/deleteByCustomerExtIdAndStageId")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "阶段ID", value = "stageId", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "客户extId", value = "customerExtId", required = true, dataType = "string", paramType = "query")
    })
    @ApiOperation(value = "根据客户extId和阶段id删除")
    @Log(modelName = "旅程阶段-客户", operatorType = "根据客户extId和阶段id删除")
    public R<Void> deleteByCustomerExtIdAndStageId(String stageId, String customerExtId) {
        Assert.isTrue(StringUtils.isNotBlank(customerExtId), "客户ID不能为空");
        Assert.isTrue(StringUtils.isNotBlank(stageId), "旅程阶段ID不能为空");
        brJourneyStageCustomerService.deleteByCustomerExtIdAndStageId(customerExtId, stageId);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "旅程阶段-客户", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto) {
        brJourneyStageCustomerService.batchDelete(dto);
        return R.success("删除成功");
    }


}
