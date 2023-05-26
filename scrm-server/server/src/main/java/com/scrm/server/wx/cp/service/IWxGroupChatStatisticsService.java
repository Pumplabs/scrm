package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.entity.WxGroupChatStatistics;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 企业微信群聊统计信息 服务类
 *
 * @author xxh
 * @since 2022-02-17
 */
public interface IWxGroupChatStatisticsService extends IService<WxGroupChatStatistics> {


    /**
     * 获取当前的统计数据
     *
     * @param extCorpId 企业ID
     * @param extChatId 企业微信群聊ID
     * @return WxGroupChatStatistics
     * @author xuxh
     * @date 2022/2/17 14:52
     */
    WxGroupChatStatistics getToday(String extCorpId, String extChatId);

}
