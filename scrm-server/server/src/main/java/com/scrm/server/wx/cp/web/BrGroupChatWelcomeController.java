package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrGroupChatWelcome;
import com.scrm.server.wx.cp.service.IBrGroupChatWelcomeService;

import com.scrm.server.wx.cp.vo.BrGroupChatWelcomeVO;

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
 * 入群欢迎语 控制器
 * @author xxh
 * @since 2022-04-24
 */
@RestController
@RequestMapping("/brGroupChatWelcome")
@Api(tags = {"入群欢迎语"})
public class BrGroupChatWelcomeController {


    @Autowired
    private IBrGroupChatWelcomeService brGroupChatWelcomeService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "入群欢迎语", operatorType = "分页查询")
    public R<IPage<BrGroupChatWelcomeVO>> pageList(@RequestBody @Valid BrGroupChatWelcomePageDTO dto){
        return R.data(brGroupChatWelcomeService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "入群欢迎语", operatorType = "查询列表")
    public R<List<BrGroupChatWelcomeVO>> list(@RequestBody @Valid BrGroupChatWelcomeQueryDTO dto){
        return R.data(brGroupChatWelcomeService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "入群欢迎语", operatorType = "根据主键查询")
    public R<BrGroupChatWelcomeVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "好友欢迎语ID不能为空");
        return R.data(brGroupChatWelcomeService.findById(id));
    }


    @PostMapping(value = "/saveOrUpdate")
    @ApiOperation(value = "新增/修改")
    @Log(modelName = "入群欢迎语", operatorType = "新增/修改")
    public R<BrGroupChatWelcome> saveOrUpdate(@RequestBody @Valid BrGroupChatWelcomeSaveOrUpdateDTO dto){
        return R.data(brGroupChatWelcomeService.saveOrUpdate(dto));
    }


    @GetMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "入群欢迎语", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "好友欢迎语ID不能为空");
        brGroupChatWelcomeService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "入群欢迎语", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brGroupChatWelcomeService.batchDelete(dto);
        return R.success("删除成功");
    }

}
