package com.scrm.server.wx.cp.handler.tp;

import me.chanjar.weixin.cp.tp.message.WxCpTpMessageHandler;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/24 14:37
 * @description：
 **/
public abstract class TpAbstractHandler implements WxCpTpMessageHandler {

    public String getMatchType(){
        return MATCH_TYPE_INFO_TYPE;
    }

    /**
     * 默认的，匹配类型是info_type
     */
    public static final String MATCH_TYPE_INFO_TYPE = "info_type";

    /**
     * 某些特殊的，匹配类型要用event
     */
    public static final String MATCH_TYPE_EVENT = "event";
}
