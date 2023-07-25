package com.scrm.server.wx.cp.web;


import com.scrm.common.constant.R;
import com.scrm.common.util.JwtUtil;
import com.scrm.server.wx.cp.service.IBrCustomerFollowService;
import com.scrm.server.wx.cp.service.IBrOrderService;
import com.scrm.server.wx.cp.service.IReportService;
import com.scrm.server.wx.cp.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/reports" )
public class ReportController {

    @Autowired
    private IReportService reportService;


    @Autowired
    private IBrOrderService orderService;

    @Autowired
    private IBrCustomerFollowService customerFollowService;

    @GetMapping("/getTodayDataOverview" )
    public R<TodayDataOverViewVO> getTodayDataOverview() {
        String extCorpId = JwtUtil.getExtCorpId();
        TodayDataOverViewVO todayDataOverViewVO = reportService.getTodayDataOverview(extCorpId);
        return R.data(todayDataOverViewVO);
    }





    @GetMapping("/getStaffOrderTotalAmountStatisticsTop5" )
    public R<TopNStatisticsListVo> getStaffOrderTotalAmountStatisticsTop5() {
        String extCorpId = JwtUtil.getExtCorpId();
        List<TopNStatisticsVo> last7days = orderService.getStaffTotalAmountByDates(extCorpId, 7, 5);
        List<TopNStatisticsVo> last30days = orderService.getStaffTotalAmountByDates(extCorpId, 30, 5);
        TopNStatisticsListVo topNStatisticsListVo = new TopNStatisticsListVo()
                .setLast7Days(last7days)
                .setLast30Days(last30days);
        return R.data(topNStatisticsListVo);
    }

    @GetMapping("/getStaffTotalFollowUpStatisticsTop5" )
    public R<TopNStatisticsListVo> getStaffTotalFollowUpStatisticsTop5() {
        String extCorpId = JwtUtil.getExtCorpId();
        List<TopNStatisticsVo> last7days = customerFollowService.getStaffTotalFollowUpByDates(extCorpId, 7, 5);
        List<TopNStatisticsVo> last30days = customerFollowService.getStaffTotalFollowUpByDates(extCorpId, 30, 5);
        TopNStatisticsListVo topNStatisticsListVo = new TopNStatisticsListVo()
                .setLast7Days(last7days)
                .setLast30Days(last30days);
        return R.data(topNStatisticsListVo);
    }
}
