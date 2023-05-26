package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xuxh
 * @date 2022/6/6 16:52
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户统计结果集")
public class WxCustomerStatisticsVO {

    @ApiModelProperty(value = "总客户数" )
    private long total;

    @ApiModelProperty(value = "今日流失数" )
    private long todayLossTotal;

    @ApiModelProperty(value = "今日新增数" )
    private long todaySaveTotal;

    @ApiModelProperty("近30日统计信息")
    private List<WxCustomerStatisticsInfoVO> last30DaysStatisticsInfos;

    @ApiModelProperty("近7日统计信息")
    private List<WxCustomerStatisticsInfoVO> last7DaysStatisticsInfos;


}
