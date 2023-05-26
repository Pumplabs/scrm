package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.server.wx.cp.dto.WxResignedStaffCustomerInfoDTO;
import com.scrm.server.wx.cp.entity.WxResignedStaffCustomer;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.server.wx.cp.vo.WxResignedStaffCustomerInfoVO;
import org.apache.ibatis.annotations.Param;

/**
 * 离职员工-客户关联 Mapper接口
 * @author xxh
 * @since 2022-06-26
 */
public interface WxResignedStaffCustomerMapper extends BaseMapper<WxResignedStaffCustomer> {

    IPage<WxResignedStaffCustomerInfoVO> pageCustomerResignedInheritance(@Param("page") Page<WxResignedStaffCustomerInfoVO> page,
                                                                         @Param("dto") WxResignedStaffCustomerInfoDTO dto);
}
