package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.MediaTag;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * （素材库）企业微信标签管理 Mapper接口
 * @author xxh
 * @since 2022-03-13
 */
public interface MediaTagMapper extends BaseMapper<MediaTag> {

    Integer findMaxOrder(String groupId);
}
