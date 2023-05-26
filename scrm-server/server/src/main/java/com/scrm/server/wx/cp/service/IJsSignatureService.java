package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.dto.JsSignatureDTO;

public interface IJsSignatureService {

    JsSignatureDTO newJsSignature(String url);

    JsSignatureDTO newAgentSignature(String url);

    JsSignatureDTO jsSignature(String url, Boolean isCorp, Integer agentId, String secret);
}
