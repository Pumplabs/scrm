package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.ContactWayStaff;
import com.scrm.server.wx.cp.mapper.ContactWayStaffMapper;
import com.scrm.server.wx.cp.service.IContactWayStaffService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 渠道活码-员工信息 服务实现类
 * @author xxh
 * @since 2021-12-26
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class ContactWayStaffServiceImpl extends ServiceImpl<ContactWayStaffMapper, ContactWayStaff> implements IContactWayStaffService {

}
