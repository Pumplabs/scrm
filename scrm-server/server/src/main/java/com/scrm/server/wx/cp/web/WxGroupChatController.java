package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.api.wx.cp.dto.WxGroupChatExportDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatPageDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatStatisticsDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatStatisticsInfoDTO;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.WxGroupChatStatisticsInfoExportDTO;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 客户群 控制器
 *
 * @author xxh
 * @since 2022-01-19
 */
@RestController
@RequestMapping("/wxGroupChat")
@Api(tags = {"客户群"})
public class WxGroupChatController {

    @Autowired
    private IWxGroupChatService wxGroupChatService;

    @GetMapping("/sync")
    @ApiOperation(value = "同步企业微信数据")
    @Log(modelName = "客户群", operatorType = "同步企业微信数据")
    @ApiImplicitParams({@ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true), @ApiImplicitParam(value = "客户群ID(用于同步单个)", name = "id")})
    public R<Void> sync(String extCorpId, String id) throws WxErrorException {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        wxGroupChatService.sync(extCorpId, id);
        return R.success();
    }

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "客户群", operatorType = "分页查询")
    public R<IPage<WxGroupChatVO>> pageList(@RequestBody @Valid WxGroupChatPageDTO dto) {
        return R.data(wxGroupChatService.pageList(dto));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "客户群", operatorType = "根据主键查询")
    public R<WxGroupChatVO> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "客户群ID不能为空");
        return R.data(wxGroupChatService.findById(id));
    }

    @GetMapping("/getByExtId")
    @ApiImplicitParams({@ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true), @ApiImplicitParam(value = "客户群extId", name = "extId", required = true)})
    @ApiOperation(value = "根据extId查询")
    @Log(modelName = "客户群", operatorType = "根据extId查询")
    public R<WxGroupChatVO> getByExtId(String extCorpId, String extId) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        Assert.isTrue(StringUtils.isNotBlank(extId), "客户群extId不能为空");
        return R.data(wxGroupChatService.getByExtId(extCorpId, extId));
    }

    @PostMapping("/getStaticsInfo")
    @ApiOperation(value = "获取统计信息")
    @Log(modelName = "客户群", operatorType = "获取统计信息")
    public R<IPage<WxGroupChatStatisticsInfoVO>> getStaticsInfo(@RequestBody @Valid WxGroupChatStatisticsInfoDTO dto) throws WxErrorException {
        return R.data(wxGroupChatService.getStaticsInfo(dto));
    }

    @PostMapping("/exportStaticsInfo")
    @ApiOperation(value = "导出统计信息")
    @Log(modelName = "客户群", operatorType = "导出统计信息")
    public void exportStaticsInfo(@RequestBody @Valid WxGroupChatStatisticsInfoExportDTO dto) {
        wxGroupChatService.exportStaticsInfo(dto);
    }

    @PostMapping("/export")
    @ApiOperation(value = "导出")
    @Log(modelName = "客户群", operatorType = "导出")
    public void exportList(@Valid @RequestBody WxGroupChatExportDTO dto) {
        wxGroupChatService.exportList(dto);
    }


    @GetMapping("/getStatics")
    @ApiOperation(value = "获取首页统计信息")
    @Log(modelName = "客户群", operatorType = "获取首页统计信息")
    public R<WxGroupChatStatisticsResultVO> getStatics(@Valid WxGroupChatStatisticsDTO dto) {
        return R.data(wxGroupChatService.getStatics(dto));
    }

    @GetMapping("/getTodayStatics")
    @ApiOperation(value = "获取今日统计信息")
    @ApiImplicitParams({@ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true),
            @ApiImplicitParam(value = "是否查询权限数据：false:否 true:是", name = "isPermission", required = true)})
    @Log(modelName = "客户群", operatorType = "获取今日统计信息")
    public R<WxGroupChatTodayStatisticsVO> getTodayStatics(String extCorpId, Boolean isPermission) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "企业ID不能为空");
        return R.data(wxGroupChatService.getTodayStatics(extCorpId,isPermission));
    }


}
