package com.scrm.server.wx.cp.service.impl;

import com.scrm.api.wx.cp.dto.JsSignatureDTO;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.SecuritySHA1Utils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.service.IBrCorpAccreditService;
import com.scrm.server.wx.cp.service.IJsSignatureService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/24 15:39
 * @description：js签名接口
 **/
@Service
@Slf4j
public class JsSignatureServiceImpl implements IJsSignatureService {

    @Autowired
    private IBrCorpAccreditService accreditService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    @Override
    public JsSignatureDTO newJsSignature(String url) {

        WxCpService wxCpService = WxCpConfiguration.getWxCpService();

        try {
            return newSignature(url, wxCpService.getJsapiTicket());
        } catch (WxErrorException e) {
            log.error("js签名失败，获取JsSignature失败，", e);
            throw new BaseException("js签名失败");
        }

    }

    @Override
    public JsSignatureDTO jsSignature(String url, Boolean isCorp, Integer agentId, String secret){

        agentId = agentId == null ? ScrmConfig.getMainAgentID(): agentId;
        secret = secret == null ? ScrmConfig.getMainAgentSecret(): secret;

        WxCpService wxCpService = WxCpConfiguration.getWxCpService(agentId, secret);

        String nonceStr = UUID.get16UUID().toLowerCase();
        Long timestamp = System.currentTimeMillis() / 1000;

        try {
            String jsApiTicket = isCorp ? wxCpService.getJsapiTicket() : wxCpService.getAgentJsapiTicket();
            String decodeStr =
                    String.format(
                            "jsapi_ticket=%s&noncestr=%s&timestamp=%d&url=%s",
                            jsApiTicket, nonceStr, timestamp, url
                    );


            return new JsSignatureDTO()
                    .setNonceStr(nonceStr)
                    .setTimestamp(timestamp)
                    .setSignature(SecuritySHA1Utils.shaEncode(decodeStr))
                    .setAgentId(ScrmConfig.getMainAgentID());
        } catch (Exception e) {
            log.error("js签名失败,[{}],", url, e);
            throw new BaseException("js签名失败");
        }
    }

    @Override
    public JsSignatureDTO newAgentSignature(String url) {

        WxCpService wxCpService = WxCpConfiguration.getWxCpService();

        try {
            return newSignature(url, wxCpService.getAgentJsapiTicket());
        } catch (WxErrorException e) {
            log.error("js签名失败，获取JsSignature失败，", e);
            throw new BaseException("js签名失败");
        }
    }

    private JsSignatureDTO newSignature(String url, String jsApiTicket){
        //拿授权信息
        String extCorpId = JwtUtil.getExtCorpId();
        if (StringUtils.isBlank(extCorpId)) {
            throw new BaseException("获取登录信息失败!");
        }

        //拿agentId
        Integer agentId = accreditService.getAgentIdByCorpId(extCorpId);

        String nonceStr = UUID.get16UUID().toLowerCase();
        Long timestamp = System.currentTimeMillis() / 1000;

        try {
            log.info("jsApiTicket=[{}]", jsApiTicket);
            String decodeStr =
                    String.format(
                            "jsapi_ticket=%s&noncestr=%s&timestamp=%d&url=%s",
                            jsApiTicket, nonceStr, timestamp, url
                    );


            return new JsSignatureDTO()
                    .setAgentId(agentId)
                    .setNonceStr(nonceStr)
                    .setTimestamp(timestamp)
                    .setSignature(SecuritySHA1Utils.shaEncode(decodeStr));
        } catch (Exception e) {
            log.error("js签名失败,[{}],", url, e);
            throw new BaseException("js签名失败");
        }
    }
}
