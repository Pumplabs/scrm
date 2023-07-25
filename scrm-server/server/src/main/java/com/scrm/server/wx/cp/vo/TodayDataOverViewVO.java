package com.scrm.server.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@ApiModel(value = "今天数据总览")
public class TodayDataOverViewVO extends YesterdayDataOverViewVO {

}
