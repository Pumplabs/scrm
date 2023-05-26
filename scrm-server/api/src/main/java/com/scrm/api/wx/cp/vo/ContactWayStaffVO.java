package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.ContactWayStaff;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2021-12-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "渠道活码-员工信息结果集")
public class ContactWayStaffVO extends ContactWayStaff{


}
