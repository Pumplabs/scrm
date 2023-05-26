package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.WxCustomerInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * 企业微信客户详情信息 Mapper接口
 * @author xxh
 * @since 2021-12-22
 */
public interface WxCustomerInfoMapper extends BaseMapper<WxCustomerInfo> {

    /**
     * 查询客户详情信息（会查出被删除的数据）
     * @param extCorpId 外部企业ID
     * @param customerExtId 客户extId
     * @param staffExtId 员工extId
     * @return 客户信息
     */
    WxCustomerInfo find(@Param("extCorpId") String extCorpId, @Param("customerExtId") String customerExtId, @Param("staffExtId") String staffExtId);
}
