package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrReportSale;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-08-01
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "每日统计的报表结果集")
public class BrReportSaleVO extends BrReportSale {


}
