package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户拉新统计结果集")
public class WxCustomerPullNewStatisticsVO {

   @ApiModelProperty("近30日统计信息")
   private List<WxCustomerPullNewStatisticsInfoVO> last30DaysStatisticsInfos;

   @ApiModelProperty("近7日统计信息")
   private List<WxCustomerPullNewStatisticsInfoVO> last7DaysStatisticsInfos;
}
