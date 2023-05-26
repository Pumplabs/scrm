package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.WxResignedStaffCustomer;
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
public class WxResignedStaffCustomerVO extends WxResignedStaffCustomer{


}
