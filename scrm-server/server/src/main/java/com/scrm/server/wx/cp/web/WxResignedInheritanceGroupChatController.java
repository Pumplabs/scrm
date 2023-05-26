package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.api.wx.cp.dto.WxGroupChatTransferInfoPageDTO;
import com.scrm.api.wx.cp.dto.WxStaffResignedTransferGroupChatDTO;
import com.scrm.api.wx.cp.vo.StaffTransferGroupChatVO;
import com.scrm.api.wx.cp.vo.WxGroupChatTransferInfoVO;
import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.WxResignedStaffGroupChatWaitPageDTO;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.vo.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

/**
 * @author xuxh
 * @date 2022/7/4 10:43
 */
@RestController
@RequestMapping("/groupChatResignedInheritance")
@Api(tags = {"群聊离职继承"})
public class WxResignedInheritanceGroupChatController {

    @Autowired
    private IWxResignedStaffGroupChatService resignedStaffGroupChatService;

    @GetMapping("/sync")
    @ApiOperation(value = "同步群聊离职继承信息")
    @Log(modelName = "群聊离职继承", operatorType = "同步群聊离职继承信息")
    public R<Void> sync(String extCorpId) throws WxErrorException {
        resignedStaffGroupChatService.sync(extCorpId);
        return R.success();
    }


    @PostMapping("/pageList")
    @ApiOperation(value = "查询群聊离职继承列表")
    @Log(modelName = "群聊离职继承", operatorType = "查询群聊离职继承列表")
    public R<IPage<WxResignedStaffGroupChatStatisticsVO>> pageList(@Valid @RequestBody WxResignedStaffGroupChatPageDTO dto){
        return R.data(resignedStaffGroupChatService.pageList(dto));
    }

    @PostMapping("/transferGroupChat")
    @ApiOperation(value = "分配客户群")
    @Log(modelName = "群聊离职继承", operatorType = "分配客户群")
    public R<StaffTransferGroupChatVO> transferGroupChat(@Valid @RequestBody WxStaffResignedTransferGroupChatDTO dto) {
        return R.data(resignedStaffGroupChatService.transferGroupChat(dto));
    }


    @PostMapping("/waitTransferPageList")
    @ApiOperation(value = "分页查询待移交群聊列表")
    @Log(modelName = "群聊离职继承", operatorType = "分页查询待移交群聊列表")
    public R<IPage<WxResignedStaffGroupChatVO>> waitTransferPageList(@Valid @RequestBody WxResignedStaffGroupChatWaitPageDTO dto) {
        return R.data(resignedStaffGroupChatService.waitTransferPageList(dto));
    }


    @PostMapping("/transferPageInfo")
    @ApiOperation(value = "分页查询群聊分配记录")
    @Log(modelName = "群聊离职继承", operatorType = "分页查询客户群聊记录")
    public R<IPage<WxGroupChatTransferInfoVO>> transferPageInfo(@Valid @RequestBody WxGroupChatTransferInfoPageDTO dto) {
        return R.data(resignedStaffGroupChatService.transferPageInfo(dto));
    }
}
