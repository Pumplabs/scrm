package com.scrm.server.wx.cp.handler.mp;

import com.scrm.api.wx.cp.dto.MpCallBackDTO;

/**
 * 微信开放平台的回调
 */
public interface AbstractMpHandler {
    
    void handler(MpCallBackDTO mpCallBackDTO);
}
