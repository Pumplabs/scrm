package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxGroupChatTagMap;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-02-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊-标签关联结果集")
public class WxGroupChatTagMapVO extends WxGroupChatTagMap{


}
