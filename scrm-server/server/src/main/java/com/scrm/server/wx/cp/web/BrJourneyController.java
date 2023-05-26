package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.IBrJourneyService;
import com.scrm.api.wx.cp.entity.BrJourney;

import com.scrm.server.wx.cp.dto.BrJourneyPageDTO;
import com.scrm.server.wx.cp.dto.BrJourneySaveDTO;
import com.scrm.server.wx.cp.dto.BrJourneyUpdateDTO;

import com.scrm.server.wx.cp.dto.BrJourneyQueryDTO;
import com.scrm.server.wx.cp.vo.BrJourneyStatisticsInfoVO;
import com.scrm.server.wx.cp.vo.BrJourneyVO;

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
 * 旅程信息 控制器
 *
 * @author xxh
 * @since 2022-04-06
 */
@RestController
@RequestMapping("/brJourney")
@Api(tags = {"旅程信息"})
public class BrJourneyController {

    @Autowired
    private IBrJourneyService brJourneyService;

    @GetMapping("/getStatistics")
    @ApiOperation(value = "获取统计信息")
    @Log(modelName = "旅程信息", operatorType = "获取统计信息")
    @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true)
    public R<List<BrJourneyStatisticsInfoVO>> getStatistics(String extCorpId ) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        return R.data(brJourneyService.getStatistics(extCorpId));
    }

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "旅程信息", operatorType = "分页查询")
    public R<IPage<BrJourneyVO>> pageList(@RequestBody @Valid BrJourneyPageDTO dto) {
        return R.data(brJourneyService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "旅程信息", operatorType = "查询列表")
    public R<List<BrJourneyVO>> list(@RequestBody @Valid BrJourneyQueryDTO dto) {
        return R.data(brJourneyService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "旅程信息", operatorType = "根据主键查询")
    public R<BrJourneyVO> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "旅程信息ID不能为空");
        return R.data(brJourneyService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "旅程信息", operatorType = "新增")
    public R<BrJourney> save(@RequestBody @Valid BrJourneySaveDTO dto) {
        return R.data(brJourneyService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "旅程信息", operatorType = "修改")
    public R<BrJourney> update(@RequestBody @Valid BrJourneyUpdateDTO dto) {
        return R.data(brJourneyService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "旅程信息", operatorType = "删除")
    public R<Void> delete(String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "旅程信息ID不能为空");
        brJourneyService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "旅程信息", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto) {
        brJourneyService.batchDelete(dto);
        return R.success("删除成功");
    }

}
