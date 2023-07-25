package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.scrm.common.config.ScrmConfig;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.service.IWxPortalService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author xuxh
 * @date 2022/2/15 9:26
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxPortalServiceImpl implements IWxPortalService {

    @Autowired
    public IWxPortalService wxPortalService;


    @Override
    public String handler(Integer agentId, String requestBody, String signature, String timestamp, String nonce) {
        log.info("\n接收微信请求：[signature=[{}], timestamp=[{}], nonce=[{}], requestBody=[\n{}\n] ",
                signature, timestamp, nonce, requestBody);

        final WxCpService wxCpService = WxCpConfiguration.getCustomerSecretWxCpService();
        WxCpXmlMessage inMessage = WxCpXmlMessage.fromEncryptedXml(requestBody, wxCpService.getWxCpConfigStorage(),
                timestamp, nonce, signature);
        log.debug("\n消息解密后内容为：\n{} ", JSON.toJSONString(inMessage));
        //返回
        WxCpXmlOutMessage outMessage = route(agentId, inMessage);
        if (outMessage == null) {
            return "";
        }
        String out = outMessage.toEncryptedXml(wxCpService.getWxCpConfigStorage());
        log.debug("\n组装回复信息：{}", out);
        return out;
    }

    public WxCpXmlOutMessage route(Integer agentId, WxCpXmlMessage message) {
        try {
            return WxCpConfiguration.getRouters().get(ScrmConfig.getMainAgentID()).route(message);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return null;
    }
}
