package com.scrm.server.wx.cp.vo;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel("TopN统计列表")
public class TopNStatisticsListVo {

    @ApiModelProperty("近7日统计信息")
    private List<TopNStatisticsVo> last7Days;

    @ApiModelProperty("近30日统计信息")
    private List<TopNStatisticsVo> last30Days;

}
