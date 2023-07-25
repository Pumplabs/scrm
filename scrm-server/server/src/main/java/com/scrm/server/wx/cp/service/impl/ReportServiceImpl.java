package com.scrm.server.wx.cp.service.impl;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.vo.TodayDataOverViewVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional(rollbackFor = Exception.class)
public class ReportServiceImpl implements IReportService {



    @Autowired
    private IBrOpportunityService opportunityService;

    @Autowired
    private IBrOrderService orderService;

    @Autowired
    private IBrCustomerFollowService customerFollowService;


    @Autowired
    private IWxCustomerService customerService;




    @Override
    public TodayDataOverViewVO getTodayDataOverview(String extCorpId) {
         TodayDataOverViewVO todayDataOverViewVO=new TodayDataOverViewVO();
         todayDataOverViewVO.setCustomerCount(customerService.countByToday());
         todayDataOverViewVO.setOpportunityCount(opportunityService.countByToday());
         todayDataOverViewVO.setFollowUpCount(customerFollowService.countByToday());
         todayDataOverViewVO.setOrderCount(orderService.countByToday());
         return todayDataOverViewVO;
    }




}
