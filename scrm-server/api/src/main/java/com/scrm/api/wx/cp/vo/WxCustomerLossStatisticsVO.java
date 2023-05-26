package com.scrm.api.wx.cp.vo;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;


/**
 * @author xxh
 * @since 2022-03-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户丢情况统计" )
public class WxCustomerLossStatisticsVO {

    @ApiModelProperty(value = "总流水客户数" )
    private long total;

    @ApiModelProperty(value = "近30天流失数" )
    private long last30DayTotal;

    @ApiModelProperty(value = "近7天流失数" )
    private long last7DayTotal;

    @ApiModelProperty(value = "今日流水数" )
    private long todayTotal;

}
