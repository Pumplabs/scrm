package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel(value = "客户转移结果VO")
public class StaffTransferCustomerVO {

    @ApiModelProperty(value = "成功发起转移客户列表")
    private List<StaffTransferCustomerInfoVO> succeedList;

    @ApiModelProperty(value = "失败发起转移客户列表")
    private List<StaffTransferCustomerInfoVO> failList;

    @ApiModelProperty(value = "成功发起条数")
    private int succeedTotal;

    @ApiModelProperty(value = "失败发起条数")
    private int failTotal;

}
