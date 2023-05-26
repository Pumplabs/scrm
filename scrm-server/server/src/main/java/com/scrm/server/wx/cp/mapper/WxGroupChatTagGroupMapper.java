package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.WxGroupChatTagGroup;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * 客户群聊标签组 Mapper接口
 * @author xxh
 * @since 2022-02-22
 */
public interface WxGroupChatTagGroupMapper extends BaseMapper<WxGroupChatTagGroup> {

    /**
     * 获取最大的排序
     * @param extCorpId 企业ID
     * @return 排序
     */
    Integer getMaxOrder(String extCorpId);
}
