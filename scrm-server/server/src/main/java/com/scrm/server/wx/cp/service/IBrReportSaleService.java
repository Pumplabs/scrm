package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.entity.BrReportSale;

/**
 * 销售日报
 * @author xxh
 * @since 2022-08-01
 */
public interface IBrReportSaleService extends IService<BrReportSale> {
   
    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-08-01
     * @param id 每日统计的报表id
     * @return com.scrm.server.wx.cp.entity.BrReportEveryday
     */
    BrReportSale checkExists(String id);

    /**
     * 生成当日报表
     * @param extCorpId
     * @return
     */
    String buildTodayReport(String extCorpId);
}
