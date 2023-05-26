package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.vo.WxCustomerPullNewStatisticsVO;
import com.scrm.api.wx.cp.vo.WxCustomerStatisticsVO;
import com.scrm.api.wx.cp.vo.WxCustomerTodayStatisticsVO;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.common.constant.R;
import com.scrm.common.exception.BaseException;
import com.scrm.common.log.annotation.Log;
import com.scrm.common.vo.FailResultVO;
import com.scrm.server.wx.cp.dto.WxCustomerAssistPageDTO;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import com.scrm.server.wx.cp.vo.BatchMarkRes;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 企业微信客户 控制器
 *
 * @author xxh
 * @since 2021-12-22
 */
@RestController
@RequestMapping("/wxCustomer")
@Api(tags = {"企业微信客户"})
public class WxCustomerController {

    @Autowired
    private IWxCustomerService wxCustomerService;


    @GetMapping("/sync")
    @ApiOperation(value = "同步企业微信数据")
    @Log(modelName = "企业微信客户", operatorType = "同步企业微信数据")
    @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true)
    public R<Void> sync(String extCorpId) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        List<RLock> lockList = wxCustomerService.getCustomerSyncLock(extCorpId);
        try {
            boolean lockAll = true;
            for (RLock rLock : lockList) {
                if (!wxCustomerService.trySyncLock(rLock)) {
                    lockAll = false;
                }
            }
            if (lockAll) {
                wxCustomerService.sync(extCorpId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new BaseException(e.getMessage());
        } finally {
            lockList.forEach(wxCustomerService::releaseSyncLock);
        }
        return R.success();
    }

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "企业微信客户", operatorType = "分页查询")
    public R<IPage<WxCustomerVO>> pageList(@RequestBody @Valid WxCustomerPageDTO dto) {
        return R.data(wxCustomerService.pageList(dto));
    }

    @PostMapping("/pageAssistList")
    @ApiOperation(value = "分页查询跟进客户列表")
    @Log(modelName = "企业微信客户", operatorType = "分页查询跟进客户列表")
    public R<IPage<WxCustomerVO>> pageAssistList(@RequestBody @Valid WxCustomerAssistPageDTO dto) {
        return R.data(wxCustomerService.pageAssistList(dto));
    }

    @PostMapping("/dropDownPageList")
    @ApiOperation(value = "下拉分页查询")
    @Log(modelName = "企业微信客户", operatorType = "下拉分页查询")
    public R<IPage<WxCustomerVO>> dropDownPageList(@RequestBody @Valid WxCustomerDropDownPageDTO dto) {
        return R.data(wxCustomerService.dropDownPageList(dto));
    }


    @PostMapping("/updateCustomerInfo")
    @ApiOperation(value = "修改客户详情")
    @Log(modelName = "企业微信客户", operatorType = "修改客户详情")
    public R<WxCustomerVO> updateCustomerInfo(@RequestBody @Valid WxCustomerInfoUpdateDTO dto) {
        return R.data(wxCustomerService.updateCustomerInfo(dto));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "企业微信客户", operatorType = "根据主键查询")
    public R<WxCustomerVO> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "id不能为空");
        return R.data(wxCustomerService.findById(id));
    }

    @GetMapping("/getByIdAndStaffId")
    @ApiOperation(value = "根据跟进员工获取客户详情")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true),
            @ApiImplicitParam(value = "客户ID", name = "id", required = true),
            @ApiImplicitParam(value = "员工ID", name = "staffId", required = true),
            @ApiImplicitParam(value = "客户extId", name = "extId", required = true)
    })
    @Log(modelName = "企业微信客户", operatorType = "根据主键查询")
    public R<WxCustomerVO> getByIdAndStaffId(String extCorpId, String id, String staffId, String extId) {
        Assert.isTrue(StringUtils.isNotBlank(id) || StringUtils.isNotBlank(extId), "id不能为空");
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "企业id不能为空");
        Assert.isTrue(StringUtils.isNotBlank(staffId), "员工id不能为空");
        return R.data(wxCustomerService.getByIdAndStaffId(extCorpId, id, staffId, extId));
    }


    @GetMapping("/getDeleteInfo")
    @ApiOperation(value = "获取已经删除的客户详情")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true),
            @ApiImplicitParam(value = "客户ID", name = "id", required = true),
            @ApiImplicitParam(value = "员工ID", name = "staffId", required = true),
            @ApiImplicitParam(value = "客户extId", name = "extId", required = true)
    })
    @Log(modelName = "企业微信客户", operatorType = "获取已经删除的客户详情")
    public R<WxCustomerVO> getDeleteInfo(String extCorpId, String id, String staffId, String extId) {
        Assert.isTrue(StringUtils.isNotBlank(id) || StringUtils.isNotBlank(extId), "id不能为空");
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "企业id不能为空");
        Assert.isTrue(StringUtils.isNotBlank(staffId), "员工id不能为空");
        return R.data(wxCustomerService.getDeleteInfo(extCorpId, id, staffId, extId));
    }


    @GetMapping("/getDetails")
    @ApiOperation(value = "获取详情信息")
    @Log(modelName = "企业微信客户", operatorType = "获取详情信息")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true),
            @ApiImplicitParam(value = "客户外部ID", name = "extId", required = true)
    })
    public R<WxCustomerVO> getDetails(String extCorpId, String extId) {
        Assert.isTrue(StringUtils.isNotBlank(extId), "extId不能为空");
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "企业id不能为空");
        return R.data(wxCustomerService.getDetails(extCorpId, extId));
    }

    @GetMapping("/export")
    @ApiOperation(value = "导出")
    @Log(modelName = "企业微信客户", operatorType = "导出")
    public void exportList(@Valid WxCustomerExportDTO dto) {
        wxCustomerService.exportList(dto);
    }


    @GetMapping("/getStatisticsInfo")
    @ApiOperation(value = "获取统计信息")
    @Log(modelName = "企业微信客户", operatorType = "获取统计信息")
    public R<WxCustomerStatisticsVO> getStatisticsInfo(@Valid WxCustomerStatisticsDTO dto) {
        return R.data(wxCustomerService.getStatisticsInfo(dto));
    }

    @GetMapping("/getTodayStatisticsInfo")
    @ApiOperation(value = "获取今日统计信息")
    @Log(modelName = "企业微信客户", operatorType = "获取今日统计信息")
    public R<WxCustomerTodayStatisticsVO> getTodayStatisticsInfo(@Valid WxCustomerTodayStatisticsDTO dto) {
        return R.data(wxCustomerService.getTodayStatisticsInfo(dto));
    }

    @GetMapping("/getPullNewStatisticsInfo")
    @ApiOperation(value = "获取拉新统计信息")
    @Log(modelName = "企业微信客户", operatorType = "获取统计信息")
    public R<WxCustomerPullNewStatisticsVO> getPullNewStatisticsInfo(@Valid WxCustomerPullNewStatisticsDTO dto) {
        return R.data(wxCustomerService.getPullNewStatisticsInfo(dto));
    }


    @PostMapping("/editTag")
    @ApiOperation(value = "编辑标签")
    @Log(modelName = "企业微信客户", operatorType = "编辑标签")
    public R<FailResultVO> editTag(@RequestBody @Valid WxCustomerTagSaveOrUpdateDTO dto) throws WxErrorException {
        return R.data(wxCustomerService.priorityEditTag(dto));
    }


    @PostMapping("/batchMarking")
    @ApiOperation(value = "批量打标")
    @Log(modelName = "企业微信客户", operatorType = "批量打标")
    public R<BatchMarkRes> batchMarking(@RequestBody @Valid WxCustomerBatchMarkingDTO dto) {
        return R.data(wxCustomerService.batchMarking(dto));
    }



}
