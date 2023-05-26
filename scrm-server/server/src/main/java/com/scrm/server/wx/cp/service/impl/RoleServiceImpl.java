package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.server.wx.cp.mapper.RoleMapper;
import com.scrm.server.wx.cp.service.IRoleService;
import com.scrm.api.wx.cp.entity.Role;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author qiu
 * @since 2021-12-13
 */
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role> implements IRoleService {

}
