package com.scrm.api.wx.cp.dto;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
@ApiModel("员工删除客户DTO" )
public class WxStaffDeleteCustomerDTO {

    @ApiModelProperty(value = "外部企业ID" )
    private String extCorpId;

    @ApiModelProperty(value = "员工ID" )
    private String staffExtId;

    @ApiModelProperty(value = "客户ID" )
    private String customerExtId;

    @ApiModelProperty(value = "类型 1:客户删除员工 2:员工删除客户" )
    private Integer type;

    @ApiModelProperty(value = "客户是因在职继承自动被转接成员删除",hidden = true)
    private Boolean deleteByTransfer;

    @ApiModelProperty(value = "删除时间")
    private Date deleteTime;

}
