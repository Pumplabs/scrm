package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.entity.SysServiceVersion;
import com.scrm.server.wx.cp.mapper.SysServiceVersionMapper;
import com.scrm.server.wx.cp.service.ISysServiceVersionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 系统版本表 服务实现类
 * @author ouyang
 * @since 2022-05-03
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class SysServiceVersionServiceImpl extends ServiceImpl<SysServiceVersionMapper, SysServiceVersion> implements ISysServiceVersionService {

}
