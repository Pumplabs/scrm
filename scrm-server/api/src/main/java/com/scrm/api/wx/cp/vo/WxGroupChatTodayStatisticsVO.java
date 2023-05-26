package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@ApiModel(value = "客户群今日统计信息")
public class WxGroupChatTodayStatisticsVO {
    @ApiModelProperty(value = "总数")
    private long totalMember;

    @ApiModelProperty(value = "入群人数")
    private long joinMemberNum;

    @ApiModelProperty(value = "退群人数")
    private long quitMemberNum;
}
