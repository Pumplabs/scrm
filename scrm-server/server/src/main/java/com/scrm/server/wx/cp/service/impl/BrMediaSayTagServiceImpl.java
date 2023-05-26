package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.entity.BrMediaSayTag;
import com.scrm.server.wx.cp.mapper.BrMediaSayTagMapper;
import com.scrm.server.wx.cp.service.IBrMediaSayTagService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * （素材库）企业微信话术标签关联表管理 服务实现类
 * @author xxh
 * @since 2022-05-10
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrMediaSayTagServiceImpl extends ServiceImpl<BrMediaSayTagMapper, BrMediaSayTag> implements IBrMediaSayTagService {

    @Override
    public BrMediaSayTag checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrMediaSayTag byId = getById(id);
        if (byId == null) {
            throw new BaseException("（素材库）企业微信话术标签关联表管理不存在");
        }
        return byId;
    }

    @Override
    public void deleteBySayId(String extCorpId, List<String> sayIds, String sayId) {
        if (ListUtils.isEmpty(sayIds) && StringUtils.isBlank(sayId)) {
            return;
        }
        remove(new QueryWrapper<BrMediaSayTag>().lambda()
                .eq(BrMediaSayTag::getExtCorpId, extCorpId)
                .in(ListUtils.isNotEmpty(sayIds), BrMediaSayTag::getSayId, sayIds)
                .eq(StringUtils.isNotBlank(sayId), BrMediaSayTag::getSayId, sayId));
    }

    @Override
    public List<String> findSayIdByTagId(String extCorpId, List<String> tagIdList) {
        List<BrMediaSayTag> list = list(new QueryWrapper<BrMediaSayTag>().lambda()
                .eq(BrMediaSayTag::getExtCorpId, extCorpId)
                .in(BrMediaSayTag::getTagId, tagIdList));

        if (ListUtils.isEmpty(list)) {
            return new ArrayList<>();
        }

        return list.stream().map(BrMediaSayTag::getSayId).collect(Collectors.toList());
    }
}
