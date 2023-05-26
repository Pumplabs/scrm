package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.MpAppIdDTO;
import com.scrm.server.wx.cp.entity.BrMpAccredit;

import java.util.List;

/**
 * 微信第三方平台授权信息 服务类
 * @author xxh
 * @since 2022-04-30
 */
public interface IBrMpAccreditService extends IService<BrMpAccredit> {


    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-04-30
     * @param id 微信第三方平台授权信息id
     * @return com.scrm.server.wx.cp.entity.BrMpAccredit
     */
    BrMpAccredit checkExists(String id);

    /**
     * 获取授权的公众号列表
     * @param extCorpId
     * @return
     */
    List<BrMpAccredit> getMpAccreditList(String extCorpId);

    /**
     * 获取授权的公众号Id
     * @param extCorpId
     * @param appId
     * @return
     */
    String getIdByAppId(String extCorpId, String appId);

    /**
     * 获取appId
     * @param extCorpId
     * @return
     */
    MpAppIdDTO getAppInfo(String extCorpId);

    MpAppIdDTO getAppInfoPrivate(String extCorpId);
}
