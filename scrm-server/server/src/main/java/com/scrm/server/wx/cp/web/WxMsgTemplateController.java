package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.WxMsgTemplate;
import com.scrm.api.wx.cp.vo.MsgTemplateExportVO;
import com.scrm.api.wx.cp.vo.WxMsgTemplateVO;
import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.service.IWxMsgTemplateService;
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
import java.util.List;

/**
 * 客户群发 控制器
 * @author xxh
 * @since 2022-02-12
 */
@RestController
@RequestMapping("/wxMsgTemplate")
@Api(tags = {"客户群发"})
public class WxMsgTemplateController {

    @Autowired
    private IWxMsgTemplateService wxMsgTemplateService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "客户群发", operatorType = "分页查询")
    public R<IPage<WxMsgTemplateVO>> pageList(@RequestBody WxMsgTemplatePageDTO dto){
        return R.data(wxMsgTemplateService.pageList(dto));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "客户群发", operatorType = "根据主键查询")
    public R<WxMsgTemplateVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群发ID不能为空");
        return R.data(wxMsgTemplateService.findById(id));
    }

    @GetMapping("/cancel")
    @ApiOperation(value = "取消")
    @Log(modelName = "客户群发", operatorType = "取消")
    public R cancel(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群发ID不能为空");
        wxMsgTemplateService.cancel(id);
        return R.success();
    }

    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "客户群发", operatorType = "新增")
    public R<WxMsgTemplate> save(@RequestBody @Valid WxMsgTemplateSaveDTO dto){
        return R.data(wxMsgTemplateService.save(dto));
    }
    
    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "客户群发", operatorType = "修改")
    public R<WxMsgTemplate> update(@RequestBody @Valid WxMsgTemplateUpdateDTO dto){
        return R.data(wxMsgTemplateService.update(dto));
    }

    @PostMapping("/countCustomer")
    @ApiOperation(value = "统计符合条件的客户数量")
    @Log(modelName = "客户群发", operatorType = "统计符合条件的客户数量")
    public R<Integer> countCustomer(@RequestBody @Valid WxMsgTemplateCountCustomerDTO dto){
        return R.data(wxMsgTemplateService.countCustomer(dto));
    }

    @ApiOperation(value = "客户列表导出")
    @Log(modelName = "客户群发", operatorType = "客户列表导出")
    @GetMapping("/exportCustomer")
    public void exportCustomer(MsgTemplateExportVO vo, HttpServletRequest request, HttpServletResponse response) {
        wxMsgTemplateService.exportCustomer(vo, request, response);
    }

    @ApiOperation(value = "员工信息导出")
    @Log(modelName = "客户群发", operatorType = "员工信息导出")
    @GetMapping("/exportStaff")
    public void exportStaff(MsgTemplateExportVO vo, HttpServletRequest request, HttpServletResponse response) {
        wxMsgTemplateService.exportStaff(vo, request, response);
    }

    @PostMapping("/remind")
    @ApiOperation(value = "提醒接口")
    @Log(modelName = "客户群发", operatorType = "提醒接口")
    public R remind(@RequestBody @Valid WxMsgTemplateRemindDTO dto){
        wxMsgTemplateService.remind(dto);
        return R.success();
    }

    @PostMapping(value = "/savePerson")
    @ApiOperation(value = "新增个人群发")
    @Log(modelName = "客户群发", operatorType = "新增个人群发")
    public R<WxMsgTemplate> savePerson(@RequestBody @Valid WxPersonTemplateSaveDTO dto) throws WxErrorException {
        return R.data(wxMsgTemplateService.savePerson(dto));
    }
    
    @PostMapping(value = "/getStaffByStatus")
    @ApiOperation("根据状态查询员工信息")
    @Log(modelName = "客户群发", operatorType = "根据状态查询员工信息")
    public R<List<WxMsgTemplateStaffDTO>> getStaffByStatus(@RequestBody @Valid TemplateFilterDTO dto){
        return R.data(wxMsgTemplateService.getStaffByStatus(dto));
    }

    @GetMapping("/deleteById/{id}")
    @ApiOperation(value = "根据主键删除")
    @Log(modelName = "客户群发", operatorType = "根据主键删除")
    public R<WxMsgTemplateVO> deleteById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群发ID不能为空");
        wxMsgTemplateService.deleteById(id);
        return R.success();
    }
}
