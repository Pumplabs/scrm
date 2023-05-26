package com.scrm.server.wx.cp.web;

import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.service.IWxPortalService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.util.crypto.WxCpCryptUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author Binary Wang(https://github.com/binarywang)
 */
@Api(tags = "微信回调网关" )
@RestController
@RequestMapping("/wx/portal/{agentId}" )
public class WxPortalController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    public IWxPortalService wxPortalService;

    @ApiOperation("测试回调" )
    @GetMapping(produces = "text/plain;charset=utf-8" )
    public String authGet(@PathVariable Integer agentId,
                          @RequestParam(name = "msg_signature", required = false) String signature,
                          @RequestParam(name = "timestamp", required = false) String timestamp,
                          @RequestParam(name = "nonce", required = false) String nonce,
                          @RequestParam(name = "echostr", required = false) String echostr) {
        this.logger.info("\n接收到来自微信服务器的认证消息：signature = [{}], timestamp = [{}], nonce = [{}], echostr = [{}]",
                signature, timestamp, nonce, echostr);

        if (StringUtils.isAnyBlank(signature, timestamp, nonce, echostr)) {
            throw new IllegalArgumentException("请求参数非法，请核实!" );
        }

         WxCpService wxCpService = WxCpConfiguration.getCustomerSecretWxCpService();
        if (wxCpService == null) {
            throw new IllegalArgumentException(String.format("未找到对应agentId=[%d]的配置，请核实！", agentId));
        }

        if (wxCpService.checkSignature(signature, timestamp, nonce, echostr)) {
           String echo =  new WxCpCryptUtil(wxCpService.getWxCpConfigStorage()).decrypt(echostr);
            this.logger.info("\n回复认证消息：{}", echo);
            return new WxCpCryptUtil(wxCpService.getWxCpConfigStorage()).decrypt(echostr);
        }

        wxCpService = WxCpConfiguration.getAddressBookWxCpService();
        if (wxCpService == null) {
            throw new IllegalArgumentException(String.format("未找到对应agentId=[%d]的配置，请核实！", agentId));
        }

        if (wxCpService.checkSignature(signature, timestamp, nonce, echostr)) {
            String echo =  new WxCpCryptUtil(wxCpService.getWxCpConfigStorage()).decrypt(echostr);
            this.logger.info("\n回复认证消息：{}", echo);
            return new WxCpCryptUtil(wxCpService.getWxCpConfigStorage()).decrypt(echostr);
        }

        return "非法请求";
    }

    @ApiOperation("回调网关" )
    @PostMapping(produces = "application/xml; charset=UTF-8" )
    public String post(@PathVariable Integer agentId,
                       @RequestBody String requestBody,
                       @RequestParam("msg_signature" ) String signature,
                       @RequestParam("timestamp" ) String timestamp,
                       @RequestParam("nonce" ) String nonce) {

        return wxPortalService.handler(agentId, requestBody, signature, timestamp, nonce);
    }


}
