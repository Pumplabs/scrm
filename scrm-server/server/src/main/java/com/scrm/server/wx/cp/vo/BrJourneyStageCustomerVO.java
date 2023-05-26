package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.server.wx.cp.entity.BrJourneyStageCustomer;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-04-06
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "旅程阶段-客户关联结果集")
public class BrJourneyStageCustomerVO extends BrJourneyStageCustomer{

    @ApiModelProperty(value = "客户信息")
    private WxCustomer customer;

    @ApiModelProperty(value = "创建员工信息")
    private Staff creatorStaff;
}
