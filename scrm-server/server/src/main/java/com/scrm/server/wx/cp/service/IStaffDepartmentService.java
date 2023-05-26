package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.entity.StaffDepartment;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 员工-部门关联服务类
 *
 * @author xxh
 * @since 2021-12-16
 */
public interface IStaffDepartmentService extends IService<StaffDepartment> {

    Long queryDepartmentStaffNum(String extCorpId, Long extId);

    void removeByStaffIds(List<String> staffIds);


    void removeByDepartmentIds(List<String> departmentIds);
}
