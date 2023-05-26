package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.WxTagGroup;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * 企业微信标签组管理 Mapper接口
 * @author xxh
 * @since 2021-12-29
 */
public interface WxTagGroupMapper extends BaseMapper<WxTagGroup> {


    /**
     * 获取最大的排序
     * @param extCorpId 企业ID
     * @return 排序
     */
    Integer getMaxOrder(String extCorpId);
}
