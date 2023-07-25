package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.WxCustomerStaffTag;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.api.wx.cp.entity.WxTag;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 客户标签 Mapper接口
 * @author xxh
 * @since 2022-01-02
 */
public interface WxCustomerStaffTagMapper extends BaseMapper<WxCustomerStaffTag> {

    List<WxTag> findTagList(@Param("extCorpId") String extCorpId, @Param("staffExtId") String staffExtId, @Param("customerExtId") String customerExtId);
}
