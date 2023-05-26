package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.service.IBrJourneyStageService;
import com.scrm.api.wx.cp.entity.BrJourneyStage;
import com.scrm.server.wx.cp.vo.BrJourneyStageVO;
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

import javax.validation.Valid;

/**
 * 旅程阶段 控制器
 *
 * @author xxh
 * @since 2022-04-06
 */
@RestController
@RequestMapping("/brJourneyStage")
@Api(tags = {"旅程阶段"})
public class BrJourneyStageController {

    @Autowired
    private IBrJourneyStageService brJourneyStageService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "旅程阶段", operatorType = "分页查询")
    public R<IPage<BrJourneyStageVO>> pageList(@RequestBody @Valid BrJourneyStagePageDTO dto) {
        return R.data(brJourneyStageService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "旅程阶段", operatorType = "查询列表")
    public R<List<BrJourneyStageVO>> list(@RequestBody @Valid BrJourneyStageQueryDTO dto) {
        return R.data(brJourneyStageService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "旅程阶段", operatorType = "根据主键查询")
    public R<BrJourneyStageVO> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "旅程阶段ID不能为空");
        return R.data(brJourneyStageService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "旅程阶段", operatorType = "新增")
    public R<BrJourneyStage> save(@RequestBody @Valid BrJourneyStageSaveDTO dto) {
        return R.data(brJourneyStageService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "旅程阶段", operatorType = "修改")
    public R<BrJourneyStage> update(@RequestBody @Valid BrJourneyStageUpdateDTO dto) {
        return R.data(brJourneyStageService.update(dto));
    }

    @PostMapping(value = "/moveAllCustomer")
    @ApiOperation(value = "移动阶段的所有客户")
    @Log(modelName = "旅程阶段", operatorType = "移动阶段的所有客户")
    public R<BrJourneyStage> moveAllCustomer(@RequestBody @Valid BrJourneyStageMoveAllCustomerDTO dto) {
        return R.data(brJourneyStageService.moveAllCustomer(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "旅程阶段", operatorType = "删除")
    public R<Void> delete(String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "旅程阶段ID不能为空");
        brJourneyStageService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "旅程阶段", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto) {
        brJourneyStageService.batchDelete(dto);
        return R.success("删除成功");
    }

}
