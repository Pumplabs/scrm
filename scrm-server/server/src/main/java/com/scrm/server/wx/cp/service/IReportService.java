package com.scrm.server.wx.cp.service;

import com.scrm.server.wx.cp.vo.TodayDataOverViewVO;
import com.scrm.server.wx.cp.vo.YesterdayDataOverViewVO;

import java.util.List;

public interface IReportService  {


    /**
     * 获取今天数据总览
     * @param extCorpId
     * @return
     */
    TodayDataOverViewVO getTodayDataOverview(String extCorpId);
}
