package com.scrm.server.wx.cp.config;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.server.wx.cp.handler.AbstractHandler;
import com.scrm.server.wx.cp.handler.LogHandler;
import com.scrm.server.wx.cp.handler.MsgHandler;
import com.scrm.server.wx.cp.handler.tp.TpAbstractHandler;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.impl.WxCpServiceImpl;
import me.chanjar.weixin.cp.config.impl.WxCpDefaultConfigImpl;
import me.chanjar.weixin.cp.message.WxCpMessageRouter;
import me.chanjar.weixin.cp.tp.message.WxCpTpMessageHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Map;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/12 20:57
 * @description：继承ScrmConfig是为了让ScrmConfig先初始化
 **/
@Slf4j
@Component
public class WxCpConfiguration extends ScrmConfig {

    @Autowired
    private LogHandler logHandler;

    @Autowired
    private MsgHandler msgHandler;

    @Autowired
    Map<String, AbstractHandler> eventHandlerMap;


    @Value("${baseApiUrl}")
    private volatile static String baseApiUrl;

    private static Map<String, WxCpService> cpServiceMap = Maps.newHashMap();

    private static Map<Integer, WxCpMessageRouter> routers = Maps.newHashMap();

    public static Map<Integer, WxCpMessageRouter> getRouters() {
        return routers;
    }

    private static WxCpService getBySecret(Integer mainAgentID, String secret, String token, String aseKey) {
        if (cpServiceMap.containsKey(secret)) {
            return cpServiceMap.get(secret);
        } else {
//            WxCpMemoryConfigStorage configStorage = new WxCpMemoryConfigStorage();
//            log.info(JSONObject.toJSONString(configStorage));
//            configStorage.setCorpId(ScrmConfig.getExtCorpID());
//            configStorage.setAgentId(mainAgentID);
//            configStorage.setCorpSecret(secret);
//            configStorage.setToken(token);
//            configStorage.setAesKey(aseKey);
//            configStorage.setBaseApiUrl(baseApiUrl);
            WxCpService wxCpService = new WxCpServiceImpl();
//            log.info(JSONObject.toJSONString(configStorage));
            WxCpDefaultConfigImpl configStorage = new WxCpDefaultConfigImpl();
            configStorage.setCorpId(ScrmConfig.getExtCorpID());
            configStorage.setAgentId(mainAgentID);
            configStorage.setCorpSecret(secret);
            configStorage.setToken(token);
            configStorage.setAesKey(aseKey);


//            configStorage.setAgentId(ScrmConfig.getMainAgentID());
//            configStorage.setCorpSecret(ScrmConfig.getCustomerSecret());
//            configStorage.setToken(ScrmConfig.getShortCallbackToken());
//            configStorage.setAesKey(ScrmConfig.getCustomerAesKey());
            configStorage.setBaseApiUrl(ScrmConfig.getBaseApiUrl());
            log.info(ScrmConfig.getBaseApiUrl()+"==================================================");
            log.info(configStorage.getApiUrl("/test")+"==================================================");
            log.info(JSONObject.toJSONString(configStorage)+"==================================================");
            wxCpService.setWxCpConfigStorage(configStorage);
            cpServiceMap.put(secret, wxCpService);
            return wxCpService;
        }
    }

    public static WxCpService getWxCpService(Integer agentId, String secret) {
        return getBySecret(agentId, secret, null, ScrmConfig.getCallbackAesKey());
    }

    public static WxCpService getWxCpService() {
        return getBySecret(ScrmConfig.getMainAgentID(), ScrmConfig.getMainAgentSecret(), null, ScrmConfig.getCallbackAesKey());
    }

    public static WxCpService getAddressBookWxCpService() {
        return getBySecret(ScrmConfig.getMainAgentID(), ScrmConfig.getContactSecret(), ScrmConfig.getCallbackToken(), ScrmConfig.getCallbackAesKey());
    }

    public static WxCpService getCustomerSecretWxCpService() {
        return getBySecret(ScrmConfig.getMainAgentID(), ScrmConfig.getCustomerSecret(), ScrmConfig.getShortCallbackToken(), ScrmConfig.getCustomerAesKey());
    }

    @PostConstruct
    public void initServices() {

        val configStorage = new WxCpDefaultConfigImpl();
        configStorage.setCorpId(ScrmConfig.getExtCorpID());
        configStorage.setAgentId(ScrmConfig.getMainAgentID());
        configStorage.setCorpSecret(ScrmConfig.getCustomerSecret());
        configStorage.setToken(ScrmConfig.getShortCallbackToken());
        configStorage.setAesKey(ScrmConfig.getCustomerAesKey());
        configStorage.setBaseApiUrl(baseApiUrl);
        val service = new WxCpServiceImpl();
        service.setWxCpConfigStorage(configStorage);
        routers.put(ScrmConfig.getMainAgentID(), this.newRouter(service));

    }

    private WxCpMessageRouter newRouter(WxCpService wxCpService) {
        final val newRouter = new WxCpMessageRouter(wxCpService);

        //事件业务处理
        Constants.WX_ALL_EVENT_TYPES.forEach(eventType -> {
            AbstractHandler abstractHandler = eventHandlerMap.get(eventType);
            if (abstractHandler != null) {
                newRouter.rule().async(false).msgType(WxConsts.XmlMsgType.EVENT)
                        .event(eventType).handler(this.logHandler, abstractHandler).end();
            }
        });

        // 记录所有事件的日志 （异步执行）
        newRouter.rule().handler(this.logHandler).next();

        // 默认
        newRouter.rule().async(false).handler(this.msgHandler).end();

        return newRouter;
    }
}
