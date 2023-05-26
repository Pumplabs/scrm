package com.scrm.server.wx.cp.feign.fallback;

import com.scrm.server.wx.cp.feign.MpAuthFeign;
import feign.hystrix.FallbackFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 11:19
 * @description：
 **/
@Component
@Slf4j
public class MpAuthFallbackFactory implements FallbackFactory<MpAuthFeign> {

    @Override
    public MpAuthFeign create(Throwable throwable) {
        log.error("微信公众号feign失败异常原因：", throwable);
        return null;
    }
}
