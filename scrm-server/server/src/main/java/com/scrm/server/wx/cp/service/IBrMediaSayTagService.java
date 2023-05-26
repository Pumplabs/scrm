package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.entity.BrMediaSayTag;

import java.util.List;

/**
 * （素材库）企业微信话术标签关联表管理 服务类
 * @author xxh
 * @since 2022-05-10
 */
public interface IBrMediaSayTagService extends IService<BrMediaSayTag> {

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-10
     * @param id （素材库）企业微信话术标签关联表管理id
     * @return com.scrm.server.wx.cp.entity.BrMediaSayTag
     */
    BrMediaSayTag checkExists(String id);

    /**
     * 根据话术id删
     * @param extCorpId
     * @param sayIds
     * @param sayId
     */
    void deleteBySayId(String extCorpId, List<String> sayIds, String sayId);

    /**
     * 根据标签id集合查询话术id集合
     * @param extCorpId
     * @param tagIdList
     */
    List<String> findSayIdByTagId(String extCorpId, List<String> tagIdList);
}
