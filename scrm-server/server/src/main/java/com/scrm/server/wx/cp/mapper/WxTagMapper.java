package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.WxTag;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * 企业微信标签管理 Mapper接口
 * @author xxh
 * @since 2021-12-29
 */
public interface WxTagMapper extends BaseMapper<WxTag> {

    /**
     * 获取最大的排序
     * @param tagGroupExtId 标签组id
     * @return
     */
    Long getMaxOrder(String tagGroupExtId);
}
