package com.scrm.server.wx.cp.dto;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrCustomerFollow;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/7/31 16:39
 * @description：每日统计结果
 **/
@Data
@ApiModel("每日统计结果")
public class EverydayCountResDTO {
    
    @ApiModelProperty("员工信息")
    private Staff staff;

    @ApiModelProperty("新增客户数量")
    private Integer addCustomer = 0;

    @ApiModelProperty("客户跟进数量")
    private List<BrCustomerFollow> followList = new ArrayList<>();

    @ApiModelProperty("订单数量")
    private Integer orderNum = 0;

    @ApiModelProperty("订单金额")
    private Double orderAmount = 0D;

    @ApiModelProperty("订单金额字符串")
    private String orderAmountStr;

    @ApiModelProperty("群发次数")
    private Integer sendNum = 0;

    @ApiModelProperty("触达客户")
    private Integer sendCustomer = 0;

    public String getOrderAmountStr() {
        return String.format("%.2f", this.orderAmount);
    }
}
