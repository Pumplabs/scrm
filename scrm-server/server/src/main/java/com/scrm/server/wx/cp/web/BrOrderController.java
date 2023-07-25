package com.scrm.server.wx.cp.web;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.IBrOrderService;
import com.scrm.server.wx.cp.entity.BrOrder;
import com.scrm.server.wx.cp.dto.BrOrderPageDTO;
import com.scrm.server.wx.cp.dto.BrOrderSaveDTO;
import com.scrm.server.wx.cp.dto.BrOrderUpdateDTO;
import com.scrm.server.wx.cp.dto.BrOrderQueryDTO;
import com.scrm.server.wx.cp.vo.BrOrderVO;
import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import com.scrm.server.wx.cp.vo.DailyTotalVO;
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
import javax.validation.constraints.NotNull;

/**
 * 订单 控制器
 * @author xxh
 * @since 2022-07-17
 */
@RestController
@RequestMapping("/BrOrder")
@Api(tags = {"订单"})
public class BrOrderController {

    @Autowired
    private IBrOrderService BrOrderService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "订单", operatorType = "分页查询")
    public R<IPage<BrOrderVO>> pageList(@RequestBody @Valid BrOrderPageDTO dto){
        return R.data(BrOrderService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "订单", operatorType = "查询列表")
    public R<List<BrOrderVO>> list(@RequestBody @Valid BrOrderQueryDTO dto){
        return R.data(BrOrderService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "订单", operatorType = "根据主键查询")
    public R<BrOrderVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "订单ID不能为空");
        return R.data(BrOrderService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "订单", operatorType = "新增")
    public R<BrOrderVO> save(@RequestBody @Valid BrOrderSaveDTO dto){
        return R.data(BrOrderService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "订单", operatorType = "修改")
    public R<BrOrder> update(@RequestBody @Valid BrOrderUpdateDTO dto){
        return R.data(BrOrderService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "订单", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "订单ID不能为空");
        BrOrderService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "订单", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        BrOrderService.batchDelete(dto);
        return R.success("删除成功");
    }


    @GetMapping("/getLastNDaysCountDaily")
    @ApiOperation(value = "获取每天新增订单数量")
    @Log(modelName = "企业微信客户", operatorType = "获取每天新增订单数量")
    public R<List<DailyTotalVO>> getLastNDaysCountDaily(@NotNull Integer days) {
        return R.data(BrOrderService.getLastNDaysCountDaily(days));
    }

}
