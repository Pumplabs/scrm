package com.scrm.server.wx.cp.web;

import com.scrm.common.annotation.PassToken;
import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.entity.BrReportSale;
import com.scrm.server.wx.cp.service.IBrReportSaleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 每日统计的报表 控制器
 * @author xxh
 * @since 2022-08-01
 */
@RestController
@RequestMapping("/brReportEveryday")
@Api(tags = {"每日统计的报表"})
public class BrReportEverydayController {

    @Autowired
    private IBrReportSaleService brReportEverydayService;

    @GetMapping("/findById")
    @ApiOperation(value = "查询某日统计的数据")
    @Log(modelName = "每日统计的报表", operatorType = "查询某日统计的数据")
    @PassToken
    public R<BrReportSale> findById(@RequestParam String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "id不能为空");
        return R.data(brReportEverydayService.checkExists(id));
    }
}
