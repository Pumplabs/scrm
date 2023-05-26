package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxStaffTransferInfo;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-05
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "员工转接记录结果集")
public class WxStaffTransferInfoVO extends WxStaffTransferInfo {

    @ApiModelProperty(value = "客户id")
    private WxCustomerVO customer;

    @ApiModelProperty(value = "接替成员")
    private StaffVO takeover;

    @ApiModelProperty(value = "原添加成员")
    private StaffVO handover;

}
