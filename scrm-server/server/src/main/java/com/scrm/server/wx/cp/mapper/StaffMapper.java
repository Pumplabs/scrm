package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.Staff;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * 员工 Mapper接口
 * @author xxh
 * @since 2021-12-16
 */
public interface StaffMapper extends BaseMapper<Staff> {


    /**
     * 根据ID查询（会查出被删除的数据）
     * @param id id
     */
    Staff findOne(String id);

    Staff findByExtCorpIdAndExtId(@Param("extCorpId") String extCorpId, @Param("extId") String extId);
}
