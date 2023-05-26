package com.scrm.server.wx.cp.service;


import com.scrm.api.wx.cp.entity.WxCustomerInfo;
import com.baomidou.mybatisplus.extension.service.IService;


/**
 * 企业微信客户详情信息 服务类
 * @author xxh
 * @since 2021-12-22
 */
public interface IWxCustomerInfoService extends IService<WxCustomerInfo> {

    /**
     * 查询客户详情信息（会查出被删除的数据）
     * @param extCorpId 外部企业ID
     * @param customerExtId 客户extId
     * @param staffExtId 员工extId
     * @return 客户信息
     */
    WxCustomerInfo find(String extCorpId, String customerExtId, String staffExtId);
}
