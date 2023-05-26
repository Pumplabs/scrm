package com.scrm.server.wx.cp.service;



/**
 * @author xuxh
 * @date 2022/2/15 9:24
 */
public interface IWxPortalService {

    /**
     * 网关业务处理逻辑
     * @author xuxh
     * @date 2022/2/15 9:26
     * @param agentId
     * @param requestBody
     * @param signature
     * @param timestamp
     * @param nonce
     * @return java.lang.String
     */
    String handler(Integer agentId,
                   String requestBody,
                   String signature,
                   String timestamp,
                   String nonce);


}
