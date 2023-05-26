package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxGroupChatTag;
import com.scrm.api.wx.cp.entity.WxGroupChatTagGroup;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * @author xxh
 * @since 2022-02-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊标签组结果集")
public class WxGroupChatTagGroupVO extends WxGroupChatTagGroup {

    @ApiModelProperty(value = "群聊标签列表")
    private List<WxGroupChatTag> tags;

}
