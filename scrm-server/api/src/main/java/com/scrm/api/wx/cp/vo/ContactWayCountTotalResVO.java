package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/7 15:53
 * @description：
 **/
@ApiModel("统计总览VO")
@Data
public class ContactWayCountTotalResVO {

    @ApiModelProperty("总数")
    private ContactWayCountResVO total;

    @ApiModelProperty("今日数")
    private ContactWayCountResVO today;
}
