package com.scrm.server.wx.cp.handler.mp;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scrm.api.wx.cp.dto.MpCallBackDTO;
import com.scrm.server.wx.cp.entity.BrMpAccredit;
import com.scrm.server.wx.cp.service.IBrMpAccreditService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/7/13 20:21
 * @description：取消授权回调
 **/
@Service("unauthorized")
@Slf4j
public class UnauthorizedHandler implements AbstractMpHandler{
    
    @Autowired
    private IBrMpAccreditService mpAccreditService;
    
    @Override
    public void handler(MpCallBackDTO mpCallBackDTO) {
        mpAccreditService.remove(new QueryWrapper<BrMpAccredit>().lambda()
                .eq(BrMpAccredit::getAuthorizerAppId, mpCallBackDTO.getAuthorizerAppid()));
    }
}
