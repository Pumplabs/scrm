package com.scrm.server.wx.cp.vo;


import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class WxCustomerStaffCountVO {

    private String extStaffId;

    private Integer total;
}
