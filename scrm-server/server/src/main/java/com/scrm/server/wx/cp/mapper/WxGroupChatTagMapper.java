package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.WxGroupChatTag;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * 客户群聊标签 Mapper接口
 * @author xxh
 * @since 2022-02-22
 */
public interface WxGroupChatTagMapper extends BaseMapper<WxGroupChatTag> {

    /**
     * 获取最大的排序
     * @param groupChatTagGroupId 标签组ID
     * @param extCorpId 企业ID
     * @return
     */
    Long getMaxOrder(@Param("extCorpId") String extCorpId, @Param("groupChatTagGroupId") String groupChatTagGroupId);
}
