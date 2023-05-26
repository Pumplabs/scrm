package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxFissionCustomer;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-客户信息结果集")
public class WxFissionCustomerVO extends WxFissionCustomer{

    @ApiModelProperty("客户的信息")
    private WxCustomer customer;

    @ApiModelProperty("状态，1->助力成功，2->不是首次添加，3->删掉了")
    private Integer status;

    public static final int SUCCESS = 1;

    public static final int NO_FIRST = 2;

    public static final int IS_DELETE = 3;
}
