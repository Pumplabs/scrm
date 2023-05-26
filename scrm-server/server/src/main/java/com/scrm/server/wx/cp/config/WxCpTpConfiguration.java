package com.scrm.server.wx.cp.config;

import com.scrm.common.config.RedisConfig;
import com.scrm.common.config.ScrmConfig;
import me.chanjar.weixin.common.redis.RedissonWxRedisOps;
import me.chanjar.weixin.cp.config.impl.WxCpTpRedissonConfigImpl;
import me.chanjar.weixin.cp.constant.WxCpApiPathConsts;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/8 17:33
 * @description：第三方的配置
 **/
@Component
public class WxCpTpConfiguration {

    @Autowired
    private RedissonClient redissonClient;

    @Value("${scrm.baseApiUrl}")
    private String baseApiUrl;

    public WxCpTpRedissonConfigImpl getBaseConfig(){
        return  WxCpTpRedissonConfigImpl.builder().baseApiUrl(WxCpApiPathConsts.DEFAULT_CP_BASE_URL)
                .suiteId(ScrmConfig.getMainSuiteID())
                .suiteSecret(ScrmConfig.getMainSuiteSecret())
                .token(ScrmConfig.getMainSuiteToken())
                .aesKey(ScrmConfig.getMainSuiteEncodingAESKey())
                .corpId(ScrmConfig.getExtCorpID())
                .corpSecret(ScrmConfig.getMainAgentSecret())
                .providerSecret(ScrmConfig.getProviderSecret())
                .keyPrefix(RedisConfig.SUITE_CONFIG)
                .baseApiUrl(baseApiUrl)
                .wxRedisOps(new RedissonWxRedisOps(redissonClient)).build();
    }

}
