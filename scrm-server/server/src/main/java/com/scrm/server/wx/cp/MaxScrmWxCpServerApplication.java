package com.scrm.server.wx.cp;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;


/**
 * 启动类
 *
 * @author xuxh
 * @date 2021/12/9 18:57
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}, scanBasePackages = "com.scrm.*")
@MapperScan("com.scrm.server.wx.cp.mapper")
@EnableAsync
@EnableDiscoveryClient
@EnableFeignClients(basePackages = {"com.scrm"})
public class MaxScrmWxCpServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(MaxScrmWxCpServerApplication.class, args);
        System.out.println("启动成功...");
    }
}
