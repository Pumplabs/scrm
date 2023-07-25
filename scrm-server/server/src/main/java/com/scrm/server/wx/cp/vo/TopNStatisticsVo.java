package com.scrm.server.wx.cp.vo;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@ApiModel("TopN统计")
public class TopNStatisticsVo {

    @ApiModelProperty(value = "总数")
    private  Long total;

    @ApiModelProperty(value = "员工ID")
    private  String staffExtId;

}
