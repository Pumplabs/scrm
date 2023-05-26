package com.scrm.server.wx.cp.feign.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 18:12
 * @description：
 **/
@Component
public class FeignConfig {

    /**
     * feign 日志记录级别
     * NONE：无日志记录（默认）
     * BASIC：只记录请求方法和 url 以及响应状态代码和执行时间。
     * HEADERS：记录请求和响应头的基本信息。
     * FULL：记录请求和响应的头、正文和元数据。
     *
     * @return Logger.Level
     */
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

}
