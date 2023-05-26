package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.BrFriendWelcomeSaveOrUpdateDTO;
import com.scrm.server.wx.cp.service.IBrFriendWelcomeService;
import com.scrm.server.wx.cp.entity.BrFriendWelcome;
import com.scrm.server.wx.cp.dto.BrFriendWelcomePageDTO;
import com.scrm.server.wx.cp.dto.BrFriendWelcomeQueryDTO;
import com.scrm.server.wx.cp.vo.BrFriendWelcomeVO;
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
 * 好友欢迎语 控制器
 * @author xxh
 * @since 2022-04-23
 */
@RestController
@RequestMapping("/brFriendWelcome")
@Api(tags = {"好友欢迎语"})
public class BrFriendWelcomeController {

    @Autowired
    private IBrFriendWelcomeService brFriendWelcomeService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "好友欢迎语", operatorType = "分页查询")
    public R<IPage<BrFriendWelcomeVO>> pageList(@RequestBody @Valid BrFriendWelcomePageDTO dto){
        return R.data(brFriendWelcomeService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "好友欢迎语", operatorType = "查询列表")
    public R<List<BrFriendWelcomeVO>> list(@RequestBody @Valid BrFriendWelcomeQueryDTO dto){
        return R.data(brFriendWelcomeService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "好友欢迎语", operatorType = "根据主键查询")
    public R<BrFriendWelcomeVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "好友欢迎语ID不能为空");
        return R.data(brFriendWelcomeService.findById(id));
    }


    @PostMapping(value = "/saveOrUpdate")
    @ApiOperation(value = "新增/修改")
    @Log(modelName = "好友欢迎语", operatorType = "新增/修改")
    public R<BrFriendWelcome> saveOrUpdate(@RequestBody @Valid BrFriendWelcomeSaveOrUpdateDTO dto){
        return R.data(brFriendWelcomeService.saveOrUpdate(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "好友欢迎语", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "好友欢迎语ID不能为空");
        brFriendWelcomeService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "好友欢迎语", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brFriendWelcomeService.batchDelete(dto);
        return R.success("删除成功");
    }
    @PostMapping("/get")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "好友欢迎语", operatorType = "批量删除")
    public R<WxMsgDTO> getMxgByStaffExtId(String extCorpId, String staffExtId){
        return R.data(brFriendWelcomeService.getMxgByStaffExtId(extCorpId,staffExtId));
    }
}
