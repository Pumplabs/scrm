package com.scrm.server.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/15 17:33
 * @description：素材首页今日统计
 **/
@Data
@ApiModel("素材首页今日统计")
public class BrMediaTodayCountVO {

    @ApiModelProperty("发送次数")
    private Integer sendCount;

    @ApiModelProperty("浏览次数")
    private Integer lookCount;
}
