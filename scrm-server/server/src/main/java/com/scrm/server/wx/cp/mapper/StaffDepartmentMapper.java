package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.StaffDepartment;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Mapper接口
 *
 * @author xxh
 * @since 2021-12-16
 */
public interface StaffDepartmentMapper extends BaseMapper<StaffDepartment> {

    Long queryDepartmentStaffNum(@Param("extCorpId") String extCorpId, @Param("extDepartmentIds") List<Long> extDepartmentIds);
}
