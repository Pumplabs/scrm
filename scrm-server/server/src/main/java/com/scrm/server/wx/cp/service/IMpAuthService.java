package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.entity.WxCustomer;

public interface IMpAuthService {

    /**
     * 根据授权code获取unionId
     * @param code
     * @param extCorpId
     * @return
     */
    String getUnionIdByCode(String code, String extCorpId);

    /**
     * 根据企业id获取企业授权的appId
     * @param extCorpId
     * @return
     */
    String getAppIdIdByCorpId(String extCorpId);

    /**
     * 根据授权code获取企业信息
     * @param code
     * @param extCorpId
     * @return
     */
    WxCustomer getCustomerByCode(String code, String extCorpId);
}
