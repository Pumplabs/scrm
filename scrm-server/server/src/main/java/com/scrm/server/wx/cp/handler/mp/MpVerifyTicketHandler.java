package com.scrm.server.wx.cp.handler.mp;

import com.scrm.api.wx.cp.dto.MpCallBackDTO;
import com.scrm.common.config.RedisConfig;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/7/13 20:14
 * @description：接受第三方回调
 **/
@Service("component_verify_ticket")
@Slf4j
public class MpVerifyTicketHandler implements AbstractMpHandler{

    @Autowired
    private RedissonClient redissonClient;
    
    @Override
    public void handler(MpCallBackDTO mpCallBackDTO) {
        redissonClient.getBucket(RedisConfig.MP_TICKET_KEY)
                .set(mpCallBackDTO.getComponentVerifyTicket(), 12, TimeUnit.HOURS);
        
    }
}
