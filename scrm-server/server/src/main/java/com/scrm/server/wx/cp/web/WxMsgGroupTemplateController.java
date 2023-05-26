package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.WxMsgGroupTemplate;
import com.scrm.api.wx.cp.vo.IdVO;
import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.api.wx.cp.vo.WxMsgGroupTemplateVO;
import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.service.IWxMsgGroupTemplateService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

/**
 * 客户群聊-群发消息 控制器
 * @author xxh
 * @since 2022-03-02
 */
@RestController
@RequestMapping("/wxMsgGroupTemplate")
@Api(tags = {"客户群聊-群发消息"})
public class WxMsgGroupTemplateController {

    @Autowired
    private IWxMsgGroupTemplateService wxMsgGroupTemplateService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "客户群聊-群发消息", operatorType = "分页查询")
    public R<IPage<WxMsgGroupTemplateVO>> pageList(@RequestBody WxMsgGroupTemplatePageDTO dto){
        return R.data(wxMsgGroupTemplateService.pageList(dto));
    }

    @GetMapping("/findById")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "客户群聊-群发消息", operatorType = "根据主键查询")
    public R<WxMsgGroupTemplate> findById(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群聊-群发消息ID不能为空");
        return R.data(wxMsgGroupTemplateService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "客户群聊-群发消息", operatorType = "新增")
    public R<WxMsgGroupTemplate> save(@RequestBody @Valid WxMsgGroupTemplateSaveDTO dto){
        return R.data(wxMsgGroupTemplateService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "客户群聊-群发消息", operatorType = "修改")
    public R<WxMsgGroupTemplate> update(@RequestBody @Valid WxMsgGroupTemplateUpdateDTO dto){
        return R.data(wxMsgGroupTemplateService.update(dto));
    }


    @GetMapping("/cancel")
    @ApiOperation(value = "取消")
    @Log(modelName = "客户群聊-群发消息", operatorType = "取消")
    public R cancel(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群发ID不能为空");
        wxMsgGroupTemplateService.cancel(id);
        return R.success();
    }

    @PostMapping("/pageChatOwnerList")
    @ApiOperation(value = "群主列表分页查询")
    @Log(modelName = "客户群聊-群发消息", operatorType = "群主列表分页查询")
    public R<IPage<StaffVO>> pageChatOwnerList(@RequestBody @Valid StaffPageDTO dto) {
        return R.data(wxMsgGroupTemplateService.pageChatOwnerList(dto));
    }

    @PostMapping("/remind")
    @ApiOperation(value = "提醒")
    @Log(modelName = "客户群聊-群发消息", operatorType = "提醒")
    public R remind(@RequestBody @Valid WxMsgTemplateRemindDTO dto){
        wxMsgGroupTemplateService.remind(dto);
        return R.success();
    }

    @PostMapping("/getChatDetails")
    @ApiOperation(value = "客户群接受详情列表查询")
    @Log(modelName = "客户群聊-群发消息", operatorType = "客户群接受详情列表查询")
    public R<IPage<MsgGroupChatDTO>> getChatDetails(@RequestBody @Valid MsgGroupChatSearchDTO dto){
        return R.data(wxMsgGroupTemplateService.getChatDetails(dto));
    }

    @PostMapping("/updateData")
    @ApiOperation(value = "更新数据")
    @Log(modelName = "客户群聊-群发消息", operatorType = "更新数据")
    public R<IPage<MsgGroupChatDTO>> updateData(@RequestBody @Valid IdVO dto){
        wxMsgGroupTemplateService.updateData(dto);
        return R.success();
    }

    @PostMapping("/getStaffDetails")
    @ApiOperation(value = "群主发送详情列表查询")
    @Log(modelName = "客户群聊-群发消息", operatorType = "群主发送详情列表查询")
    public R<IPage<MsgGroupStaffDTO>> getStaffDetails(@RequestBody @Valid MsgGroupStaffSearchDTO dto){
        return R.data(wxMsgGroupTemplateService.getStaffDetails(dto));
    }

    @ApiOperation(value = "客户群接受详情导出")
    @Log(modelName = "客户群聊-群发消息", operatorType = "客户群接受详情导出")
    @GetMapping("/exportChatDetails")
    public void exportChatDetails(MsgGroupChatSearchDTO vo, HttpServletRequest request, HttpServletResponse response) {
        wxMsgGroupTemplateService.exportChatDetails(vo, request, response);
    }

    @GetMapping("/exportStaffDetails")
    @ApiOperation(value = "群主发送详情导出")
    @Log(modelName = "客户群聊-群发消息", operatorType = "群主发送详情导出")
    public void exportStaffDetails(MsgGroupStaffSearchDTO dto, HttpServletRequest request, HttpServletResponse response){
        wxMsgGroupTemplateService.exportStaffDetails(dto, request, response);
    }

    @PostMapping(value = "/savePerson")
    @ApiOperation(value = "新增个人客户群群发")
    @Log(modelName = "客户群聊-群发消息", operatorType = "新增个人客户群群发")
    public R<WxMsgGroupTemplate> savePerson(@RequestBody @Valid WxPersonTemplateSaveDTO dto) throws WxErrorException {
        return R.data(wxMsgGroupTemplateService.savePerson(dto));
    }

    @GetMapping("/deleteById")
    @ApiOperation(value = "根据主键删除")
    @Log(modelName = "客户群聊-群发消息", operatorType = "根据主键删除")
    public R<WxMsgGroupTemplate> deleteById(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群聊-群发消息ID不能为空");
        wxMsgGroupTemplateService.deleteById(id);
        return R.success();
    }
}
