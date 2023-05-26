package com.scrm.server.wx.cp.web;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.IBrTodoService;
import com.scrm.server.wx.cp.entity.BrTodo;

import com.scrm.server.wx.cp.dto.BrTodoPageDTO;
import com.scrm.server.wx.cp.dto.BrTodoSaveDTO;
import com.scrm.server.wx.cp.dto.BrTodoUpdateDTO;

import com.scrm.server.wx.cp.dto.BrTodoQueryDTO;
import com.scrm.server.wx.cp.vo.BrTodoVO;

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
 * 待办 控制器
 * @author ouyang
 * @since 2022-05-20
 */
@RestController
@RequestMapping("/brTodo")
@Api(tags = {"待办"})
public class BrTodoController {

    @Autowired
    private IBrTodoService brTodoService;

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "待办", operatorType = "分页查询")
    public R<IPage<BrTodoVO>> pageList(@RequestBody @Valid BrTodoPageDTO dto){
        return R.data(brTodoService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "待办", operatorType = "查询列表")
    public R<List<BrTodoVO>> list(@RequestBody @Valid BrTodoQueryDTO dto){
        return R.data(brTodoService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "待办", operatorType = "根据主键查询")
    public R<BrTodoVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "待办ID不能为空");
        return R.data(brTodoService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "待办", operatorType = "新增")
    public R<BrTodo> save(@RequestBody @Valid BrTodoSaveDTO dto){
        return R.data(brTodoService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "待办", operatorType = "修改")
    public R<BrTodo> update(@RequestBody @Valid BrTodoUpdateDTO dto){
        return R.data(brTodoService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "待办", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "待办ID不能为空");
        brTodoService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "待办", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brTodoService.batchDelete(dto);
        return R.success("删除成功");
    }

}
