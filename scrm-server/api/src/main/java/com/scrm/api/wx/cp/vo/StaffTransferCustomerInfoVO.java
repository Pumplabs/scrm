package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;


@Data
@Accessors(chain = true)
@ApiModel(value = "客户转移详情")
public class StaffTransferCustomerInfoVO {

    @ApiModelProperty(value = "客户ID")
    private String customerId;

    @ApiModelProperty(value = "客户用户ID")
    private String customerUserId;

    @ApiModelProperty(value = "名称，微信用户对应微信昵称；企业微信用户，则为联系人或管理员设置的昵称、认证的实名和账号名称")
    private String customerName;

    @ApiModelProperty(value = "微信错误code")
    private long errCode;

    @ApiModelProperty(value = "微信错误原因")
    private String errMsg;

}
