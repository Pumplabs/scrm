package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxFissionTaskCustomerDetail;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/29 19:25
 * @description：企微应用宝-客户完成详情VO
 **/
@Data
@ApiModel("企微应用宝-客户完成详情VO")
public class WxFissionTaskCustomerDetailVO extends WxFissionTaskCustomerDetail {

    @ApiModelProperty("领奖客服")
    private Staff staff;

    @ApiModelProperty("客户信息")
    private WxCustomer customer;

}
