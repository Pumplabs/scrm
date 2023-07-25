package com.scrm.server.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@ApiModel(value = "数据总览")
public class YesterdayDataOverViewVO {

    @ApiModelProperty(value = "新增客户数")
    private Long customerCount;

    @ApiModelProperty(value = "新增商机")
    private Long opportunityCount;

    @ApiModelProperty(value = "新增订单数")
    private Long orderCount;

    @ApiModelProperty(value = "新增跟进")
    private Long followUpCount;
}
