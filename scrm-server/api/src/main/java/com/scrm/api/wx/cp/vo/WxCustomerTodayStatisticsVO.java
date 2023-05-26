package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author xuxh
 * @date 2022/7/7 19:10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户今日统计结果集")
public class WxCustomerTodayStatisticsVO {

    @ApiModelProperty(value = "总客户数" )
    private long total;

    @ApiModelProperty(value = "今日流失数" )
    private long todayLossTotal;

    @ApiModelProperty(value = "今日新增数" )
    private long todaySaveTotal;
}
