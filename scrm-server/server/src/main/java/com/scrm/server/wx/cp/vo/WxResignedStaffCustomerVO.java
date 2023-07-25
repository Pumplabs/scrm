package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.server.wx.cp.entity.WxResignedStaffCustomer;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-06-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "离职员工-客户关联结果集")
public class WxResignedStaffCustomerVO extends WxResignedStaffCustomer {

    @ApiModelProperty(value = "客戶")
    private WxCustomerVO customer;

    @ApiModelProperty(value = "接替成员")
    private StaffVO takeoverStaff;

    @ApiModelProperty(value = "原添加成员")
    private StaffVO handoverStaff;
}
