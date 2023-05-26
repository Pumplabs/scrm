package com.scrm.server.wx.cp.mapper;

import com.scrm.common.entity.SysRole;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * 角色信息表 Mapper接口
 * @author xxh
 * @since 2022-06-16
 */
public interface SysRoleMapper extends BaseMapper<SysRole> {

    Integer getMaxSort();

}
