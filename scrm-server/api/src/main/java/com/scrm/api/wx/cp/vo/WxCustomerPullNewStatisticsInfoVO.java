package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;


@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户拉新统计详情")
public class WxCustomerPullNewStatisticsInfoVO {

    @ApiModelProperty(value = "员工extId")
    private String extStaffId;

    @ApiModelProperty(value = "新客户数量")
    private long newCustomerTotal;
}
