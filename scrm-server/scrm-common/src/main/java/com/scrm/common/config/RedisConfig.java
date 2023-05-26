package com.scrm.common.config;

import lombok.Data;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.redisson.config.Config;
import org.springframework.stereotype.Component;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/8 15:36
 * @description：redis管理
 **/
@Data
@Component
@ConfigurationProperties(prefix = "redis")
public class RedisConfig {

    public static final String SUITE_CONFIG = "suite:";

    public static final String SUITE_TICKET_KEY = "suite:ticket";

    public static final String MP_TICKET_KEY = "MP_TICKET_KEY";

    public static final String MP_TOKEN_KEY = "MP_TOKEN_KEY";

    public static final String MP_PRE_CODE_KEY = "MP_PRE_CODE_KEY";

    private String ip;

    private String port;

    private String password;

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer().setAddress(ip + ":" + port)
                .setPassword(password);
        return Redisson.create(config);
    }
}
