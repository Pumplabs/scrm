package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrCustomerFollow;
import com.scrm.server.wx.cp.entity.BrCustomerFollowReply;
import com.scrm.server.wx.cp.service.IBrCustomerFollowMsgService;
import com.scrm.server.wx.cp.service.IBrCustomerFollowReplyService;
import com.scrm.server.wx.cp.service.IBrCustomerFollowService;
import com.scrm.server.wx.cp.service.IBrFollowTaskService;
import com.scrm.server.wx.cp.vo.BrCustomerFollowMsgVO;
import com.scrm.server.wx.cp.vo.BrCustomerFollowVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 客户跟进 控制器
 * @author xxh
 * @since 2022-05-19
 */
@RestController
@RequestMapping("/brCustomerFollow")
@Api(tags = {"客户跟进"})
public class BrCustomerFollowController {

    @Autowired
    private IBrCustomerFollowService brCustomerFollowService;

    @Autowired
    private IBrCustomerFollowReplyService brCustomerFollowReplyService;

    @Autowired
    private IBrCustomerFollowMsgService brCustomerFollowMsgService;

    @Autowired
    private IBrFollowTaskService brFollowTaskService;

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "客户跟进", operatorType = "分页查询")
    public R<IPage<BrCustomerFollowVO>> pageList(@RequestBody @Valid BrCustomerFollowPageDTO dto){
        return R.data(brCustomerFollowService.pageList(dto));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "客户跟进", operatorType = "根据主键查询")
    public R<BrCustomerFollowVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户跟进ID不能为空");
        return R.data(brCustomerFollowService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "客户跟进", operatorType = "新增")
    public R save(@RequestBody @Valid BrCustomerFollowSaveDTO dto){
        brCustomerFollowService.save(dto);
        return R.success();
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "客户跟进", operatorType = "修改")
    public R<BrCustomerFollow> update(@RequestBody @Valid BrCustomerFollowUpdateDTO dto){
        return R.data(brCustomerFollowService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "客户跟进", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户跟进ID不能为空");
        brCustomerFollowService.delete(id);
        return R.success("删除成功");
    }

    @PostMapping(value = "/saveReply")
    @ApiOperation(value = "新增回复")
    @Log(modelName = "客户跟进", operatorType = "新增回复")
    public R<BrCustomerFollowReply> saveReply(@RequestBody @Valid BrCustomerFollowReplySaveDTO dto){
        return R.data(brCustomerFollowReplyService.save(dto));
    }

    @PostMapping("/deleteReply")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除回复")
    @Log(modelName = "客户跟进", operatorType = "删除回复")
    public R<Void> deleteReply(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户跟进的消息ID不能为空");
        brCustomerFollowReplyService.delete(id);
        return R.success("删除成功");
    }

    @PostMapping("/pageListMsg")
    @ApiOperation(value = "分页查询跟进通知消息")
    @Log(modelName = "客户跟进", operatorType = "分页查询跟进通知消息")
    public R<IPage<BrCustomerFollowMsgVO>> pageListMsg(@RequestBody @Valid BrCustomerFollowMsgPageDTO dto){
        return R.data(brCustomerFollowMsgService.pageList(dto));
    }

    @GetMapping("/readMsg")
    @ApiOperation(value = "读消息")
    @Log(modelName = "客户跟进", operatorType = "读消息")
    public R readMsg(@RequestParam String extCorpId, @RequestParam String id){
        brCustomerFollowMsgService.readMsg(extCorpId, id);
        return R.success();
    }

    @GetMapping("/readMsgByFollow")
    @ApiOperation(value = "读消息（根据跟进id）")
    @Log(modelName = "客户跟进", operatorType = "读消息（根据跟进id）")
    public R readMsgByFollow(@RequestParam String extCorpId, @RequestParam String followId){
        brCustomerFollowMsgService.readMsgByFollow(extCorpId, followId);
        return R.success();
    }

    @GetMapping("/finishTask")
    @ApiOperation(value = "完成跟进的任务")
    @Log(modelName = "客户跟进", operatorType = "完成跟进的任务")
    public R finishTask(@RequestParam String extCorpId, @RequestParam String taskId){
        brFollowTaskService.finishTask(extCorpId, taskId);
        return R.success();
    }
}
