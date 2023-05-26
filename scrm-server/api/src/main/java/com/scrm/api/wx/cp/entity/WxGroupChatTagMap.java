package com.scrm.api.wx.cp.entity;

import java.io.Serializable;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;

/**
 * 客户群聊-标签关联
 * @author xxh
 * @since 2022-02-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊-标签关联")
@TableName("wx_group_chat_tag_map")
public class WxGroupChatTagMap implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "客户群聊ID")
    @TableId
    private String groupChatId;

    @ApiModelProperty(value = "群聊标签ID")
    private String groupChatTagId;


}
