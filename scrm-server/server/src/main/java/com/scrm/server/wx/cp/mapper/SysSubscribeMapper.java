package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.common.entity.SysSubscribe;

/**
 * 企业订阅管理 Mapper接口
 * @author ouyang
 * @since 2022-05-07
 */
public interface SysSubscribeMapper extends BaseMapper<SysSubscribe> {

    int recoveryByCorpId(String corpId);

    SysSubscribe getByCorpIdWithDelete(String corpId);
}
