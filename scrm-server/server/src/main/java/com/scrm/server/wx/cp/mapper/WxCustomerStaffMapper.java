package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.api.wx.cp.vo.ContactWayCountParamsVO;
import com.scrm.api.wx.cp.vo.WxCustomerPullNewStatisticsInfoVO;
import com.scrm.server.wx.cp.vo.WxCustomerStaffCountVO;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * 企业微信客户-员工关联表 Mapper接口
 * @author xxh
 * @since 2021-12-22
 */
public interface WxCustomerStaffMapper extends BaseMapper<WxCustomerStaff> {

    List<WxCustomerStaffCountVO> countGroupByStaffExtId(String extCorpId);

    List<WxCustomerStaff> listByCondition(ContactWayCountParamsVO paramsVO);

    Integer countByDate(@Param("extCorpId") String extCorpId, @Param("extStaffId") String extStaffId,
                        @Param("state") String state, @Param("date") Date date);

    WxCustomerStaffCountVO getCountGroup(@Param("extCorpId") String extCorpId, @Param("extStaffId") String extStaffId);

    List<WxCustomerPullNewStatisticsInfoVO> getPullNewStatisticsInfo(@Param("extCorpId") String extCorpId, @Param("topNum") Integer topNum,
                                                                     @Param("beginDate") Date beginDate, @Param("endDate") Date endDate);

    WxCustomerStaff findHasDelete(@Param("extCorpId") String extCorpId,
                                  @Param("extStaffId") String extStaffId,
                                  @Param("extCustomerId") String extCustomerId);

    WxCustomerStaff findById(@Param("id") String id);

    long countByExtCorpId(@Param("extCorpId") String extCorpId, @Param("begin") Date begin, @Param("end") Date end, @Param("staffExtId") String staffExtId);


}
