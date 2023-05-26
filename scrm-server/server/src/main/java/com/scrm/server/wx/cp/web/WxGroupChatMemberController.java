package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;

import com.scrm.api.wx.cp.dto.WxGroupChatMemberExportDTO;
import com.scrm.server.wx.cp.service.IWxGroupChatMemberService;
import com.scrm.api.wx.cp.dto.WxGroupChatMemberPageDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatMemberQueryDTO;
import com.scrm.api.wx.cp.vo.WxGroupChatMemberVO;

import com.scrm.common.constant.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 客户群聊成员 控制器
 *
 * @author xxh
 * @since 2022-01-19
 */
@RestController
@RequestMapping("/wxGroupChatMember")
@Api(tags = {"客户群聊成员"})
public class WxGroupChatMemberController {

    @Autowired
    private IWxGroupChatMemberService wxGroupChatMemberService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "客户群聊成员", operatorType = "分页查询")
    public R<IPage<WxGroupChatMemberVO>> pageList(@RequestBody @Valid WxGroupChatMemberPageDTO dto) {
        return R.data(wxGroupChatMemberService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "客户群聊成员", operatorType = "查询列表")
    public R<List<WxGroupChatMemberVO>> list(@RequestBody @Valid WxGroupChatMemberQueryDTO dto) {
        return R.data(wxGroupChatMemberService.queryList(dto));
    }

    @PostMapping("/export")
    @ApiOperation(value = "导出")
    @Log(modelName = "客户群聊成员", operatorType = "导出")
    public void exportList(@RequestBody @Valid WxGroupChatMemberExportDTO dto) {
        wxGroupChatMemberService.exportList(dto);
    }

}
