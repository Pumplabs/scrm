package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.Department;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.vo.DepartmentTreeVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Mapper接口
 *
 * @author xxh
 * @since 2021-12-16
 */
public interface DepartmentMapper extends BaseMapper<Department> {

    List<DepartmentTreeVO> getTree(String extCorpId);

    List<DepartmentTreeVO> getTreeWithStaffMap(String extCorpId);


    List<DepartmentTreeVO> queryChildren(@Param("extCorpId") String extCorpId, @Param("extParentId") String extParentId);

    List<DepartmentTreeVO> queryChildrenWithStaff(@Param("extCorpId") String extCorpId, @Param("extParentId") String extParentId);

    /**
     * 根据父部门id集合查询子部门id集合
     */
    List<Long> queryChildIdList(@Param("extCorpId") String extCorpId, @Param("extParentIdList") List<Long> extParentIdList);

    List<Staff> queryStaffByDept(@Param("extCorpId") String extCorpId, @Param("extParentIdList") List<Integer> extParentIdList);

}
