package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2021-12-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户-员工关联表结果集")
public class WxCustomerStaffVO extends WxCustomerStaff{

    @ApiModelProperty("客户信息")
    private WxCustomer wxCustomer;

    @ApiModelProperty("员工信息")
    private Staff staff;

    @ApiModelProperty("错误信息")
    private String failMsg;
}
