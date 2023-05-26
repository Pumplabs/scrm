package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.WxDynamicMedia;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.server.wx.cp.dto.BrMediaCountQueryDTO;
import com.scrm.server.wx.cp.dto.DynamicMediaCountDTO;

import java.util.List;

/**
 * 客户查看素材的动态 Mapper接口
 * @author xxh
 * @since 2022-03-16
 */
public interface WxDynamicMediaMapper extends BaseMapper<WxDynamicMedia> {

    List<DynamicMediaCountDTO> countByMediaId(BrMediaCountQueryDTO dto);
}
