package com.scrm.server.wx.cp.config;

import com.scrm.server.wx.cp.filter.AuthenticationInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/7 13:53
 * @description：后台服务的配置
 **/
@Configuration
public class WxCpWebAppConfig implements WebMvcConfigurer {

    /**
     * jwt拦截器
     * @param registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticationInterceptor())
                .addPathPatterns("/*/*");
    }

    @Bean
    public AuthenticationInterceptor authenticationInterceptor() {
        return new AuthenticationInterceptor();
    }
}
