package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxGroupChatStatistics;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author xuxh
 * @date 2022/2/11 15:35
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群统计信息")
public class WxGroupChatStatisticsInfoVO extends WxGroupChatStatistics {

}
