package com.scrm.server.wx.cp.web;

import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.BrSaleTargetQueryDTO;
import com.scrm.server.wx.cp.dto.BrSaleTargetSaveDTO;
import com.scrm.server.wx.cp.dto.BrSaleTargetUpdateDTO;
import com.scrm.server.wx.cp.entity.BrSaleTarget;
import com.scrm.server.wx.cp.service.IBrSaleTargetService;
import com.scrm.server.wx.cp.vo.BrSaleTargetVO;
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
 * 销售目标 控制器
 * @author xxh
 * @since 2022-07-20
 */
@RestController
@RequestMapping("/brSaleTarget")
@Api(tags = {"销售目标"})
public class BrSaleTargetController {

    @Autowired
    private IBrSaleTargetService brSaleTargetService;

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "销售目标", operatorType = "查询列表")
    public R<List<BrSaleTargetVO>> list(@RequestBody @Valid BrSaleTargetQueryDTO dto){
        return R.data(brSaleTargetService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "销售目标", operatorType = "根据主键查询")
    public R<List<BrSaleTargetVO>> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "销售目标ID不能为空");
        return R.data(brSaleTargetService.findById(id));
    }


    @GetMapping("/getStaffCurrentMonthSalesTarget")
    @ApiOperation(value = "获取员工本月销售目标")
    @Log(modelName = "销售目标", operatorType = "获取员工本月销售目标")
    public R<BrSaleTargetVO> getStaffCurrentMonthSalesTarget(){
        return R.data(brSaleTargetService.getStaffCurrentMonthSalesTarget());
    }



    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "销售目标", operatorType = "新增")
    public R<BrSaleTarget> save(@RequestBody @Valid BrSaleTargetSaveDTO dto){
        return R.data(brSaleTargetService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "销售目标", operatorType = "修改")
    public R<BrSaleTarget> update(@RequestBody @Valid BrSaleTargetUpdateDTO dto){
        return R.data(brSaleTargetService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "销售目标", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "销售目标ID不能为空");
        brSaleTargetService.delete(id);
        return R.success("删除成功");
    }



}
