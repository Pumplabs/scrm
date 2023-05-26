package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author xuxh
 * @date 2022/6/7 12:19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群拉新结果集")
public class WxGroupChatPullNewStatisticsVO {

    @ApiModelProperty(value = "员工extId")
    private String extStaffId;

    @ApiModelProperty(value = "拉新人数")
    private long pullNewTotal;
}
