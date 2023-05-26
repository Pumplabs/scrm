package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.entity.WxContactExpiration;

import java.util.Date;

/**
 * 渠道码，过期时间表 服务类
 * @author xxh
 * @since 2022-03-22
 */
public interface IWxContactExpirationService extends IService<WxContactExpiration> {

    /**
     * 新增管理的渠道码
     * @param extCorpId
     * @param configId
     * @param groupId
     * @param expire  这个参数好像没啥用
     */
    void saveOrUpdate(String extCorpId, String configId, String groupId, Date expire);

    /**
     * 生成定时任务
     * @param extCorpId
     * @param groupId
     * @param codeExpiredTime
     */
    Integer createJob(String extCorpId, String groupId, Date codeExpiredTime);

    /**
     * 处理过期的渠道码
     * @param extCorpId
     * @param groupId
     */
    void handleExpiration(String extCorpId, String groupId);
}
