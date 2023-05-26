package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.server.wx.cp.entity.BrOrder;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import java.util.List;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "订单结果集")
public class BrOrderVO extends BrOrder{

    @ApiModelProperty(value = "客户")
    private WxCustomer customer;

    @ApiModelProperty(value = "订单关联产品列表")
    private List<BrOrderProductVO> orderProductList;

    @ApiModelProperty(value = "负责员工")
    private Staff managerStaff;

    @ApiModelProperty(value = "创建员工")
    private Staff creatorStaff;

}
