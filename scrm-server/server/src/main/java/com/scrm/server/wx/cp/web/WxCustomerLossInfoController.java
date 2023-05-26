package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.api.wx.cp.vo.WxCustomerLossStatisticsVO;
import com.scrm.server.wx.cp.service.IWxCustomerLossInfoService;
import com.scrm.api.wx.cp.entity.WxCustomerLossInfo;

import com.scrm.api.wx.cp.dto.WxCustomerLossInfoPageDTO;
import com.scrm.server.wx.cp.vo.WxCustomerLossInfoVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import io.swagger.annotations.ApiImplicitParam;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


/**
 * 客户流失情况信息 控制器
 *
 * @author xxh
 * @since 2022-03-26
 */
@RestController
@RequestMapping("/wxCustomerLossInfo" )
@Api(tags = {"客户流失情况信息"})
public class WxCustomerLossInfoController {

    @Autowired
    private IWxCustomerLossInfoService wxCustomerLossInfoService;


    @PostMapping("/pageList" )
    @ApiOperation(value = "分页查询" )
    @Log(modelName = "客户流失情况信息", operatorType = "分页查询")
    public R<IPage<WxCustomerLossInfoVO>> pageList(@RequestBody @Valid WxCustomerLossInfoPageDTO dto) {
        return R.data(wxCustomerLossInfoService.pageList(dto));
    }

    @GetMapping("/{id}" )
    @ApiOperation(value = "根据主键查询" )
    @Log(modelName = "客户流失情况信息", operatorType = "根据主键查询")
    public R<WxCustomerLossInfo> findById(@PathVariable(value = "id" ) String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "客户流失情况信息ID不能为空" );
        return R.data(wxCustomerLossInfoService.findById(id));
    }

    @GetMapping("/getStatistics" )
    @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true)
    @ApiOperation(value = "获取统计详细" )
    @Log(modelName = "客户流失情况信息", operatorType = "获取统计详细")
    public R<WxCustomerLossStatisticsVO> getStatistics(String extCorpId) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空" );
        return R.data(wxCustomerLossInfoService.getStatistics(extCorpId));
    }


}
