package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xuxh
 * @date 2022/6/7 11:22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群首页统计信息结果集")
public class WxGroupChatStatisticsResultVO {

    @ApiModelProperty(value = "群总数")
    private long todayTotal;

    @ApiModelProperty(value = "今日统计信息")
    private WxGroupChatStatisticsVO todayStatisticsInfo;

    @ApiModelProperty(value = "近7天统计信息")
    private List<WxGroupChatStatisticsVO> last7StatisticsInfos;

    @ApiModelProperty(value = "近30天统计信息")
    private List<WxGroupChatStatisticsVO> last30StatisticsInfos;


    @ApiModelProperty(value = "近7天拉新统计信息")
    private List<WxGroupChatPullNewStatisticsVO> last7PullNewStatisticsInfos;

    @ApiModelProperty(value = "近30天拉新统计信息")
    private List<WxGroupChatPullNewStatisticsVO> last30PullNewStatisticsInfos;
}
