package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.WxCustomerStaffAssist;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-08-02
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户-员工跟进协助人结果集")
public class WxCustomerStaffAssistVO extends WxCustomerStaffAssist{


}
