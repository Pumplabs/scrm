package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.api.wx.cp.entity.WxCustomerLossInfo;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户流失情况信息结果集" )
public class WxCustomerLossInfoVO extends WxCustomerLossInfo {

    @ApiModelProperty(value = "客户信息" )
    private WxCustomerVO customer;

    @ApiModelProperty(value = "员工信息" )
    private StaffVO staff;

}
