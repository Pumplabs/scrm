package com.scrm.server.wx.cp.builder;

import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;

/**
 *  @author Binary Wang(https://github.com/binarywang)
 */
public abstract class AbstractBuilder {

  public abstract WxCpXmlOutMessage build(String content, WxCpXmlMessage wxMessage, WxCpService service);

  public abstract WxCpXmlOutMessage build(String content, WxCpTpXmlMessage wxMessage, WxCpService service);
}
