package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.scrm.api.wx.cp.entity.Department;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.service.IDepartmentService;
import lombok.extern.slf4j.Slf4j;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.StaffDepartment;
import com.scrm.server.wx.cp.mapper.StaffDepartmentMapper;
import com.scrm.server.wx.cp.service.IStaffDepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * 服务实现类
 *
 * @author xxh
 * @since 2021-12-16
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class StaffDepartmentServiceImpl extends ServiceImpl<StaffDepartmentMapper, StaffDepartment> implements IStaffDepartmentService {

    @Autowired
    private IDepartmentService departmentService;

    @Override
    public Long queryDepartmentStaffNum(String extCorpId, Long extId) {
        List<Long> extDepartmentIds = null;

        //如果是不是根部门递归查出子部门列表
        if (!Objects.equals(1L, extId)) {
            extDepartmentIds = departmentService.getChildIdList(extCorpId, Collections.singletonList(extId));
        }

        return baseMapper.queryDepartmentStaffNum(extCorpId, extDepartmentIds);
    }

    @Override
    public void removeByStaffIds(List<String> staffIds) {
        if (ListUtils.isNotEmpty(staffIds)) {
            remove(new LambdaQueryWrapper<StaffDepartment>().in(StaffDepartment::getStaffId, staffIds));
        }
    }

    @Override
    public void removeByDepartmentIds(List<String> departmentIds) {
        if (ListUtils.isNotEmpty(departmentIds)) {
            remove(new LambdaQueryWrapper<StaffDepartment>().in(StaffDepartment::getDepartmentId, departmentIds));
        }
    }
}
