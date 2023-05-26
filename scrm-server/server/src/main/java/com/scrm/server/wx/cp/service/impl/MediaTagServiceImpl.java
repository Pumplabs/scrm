package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.UUID;
import com.scrm.api.wx.cp.dto.MediaTagSaveDTO;
import com.scrm.api.wx.cp.entity.MediaTag;
import com.scrm.api.wx.cp.entity.MediaTagGroup;
import com.scrm.server.wx.cp.mapper.MediaTagMapper;
import com.scrm.server.wx.cp.service.IMediaTagGroupService;
import com.scrm.server.wx.cp.service.IMediaTagService;
import com.scrm.api.wx.cp.vo.MediaTagVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

/**
 * （素材库）企业微信标签管理 服务实现类
 * @author xxh
 * @since 2022-03-13
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class MediaTagServiceImpl extends ServiceImpl<MediaTagMapper, MediaTag> implements IMediaTagService {

    @Autowired
    private IMediaTagGroupService tagGroupService;

    @Autowired
    private MediaTagMapper mediaTagMapper;

    @Override
    public MediaTagVO findById(String id){
        return translation(checkExists(id));
    }


    @Override
    public MediaTag save(MediaTagSaveDTO dto){

        //标签组
        MediaTagGroup mediaTagGroup = tagGroupService.checkExists(dto.getGroupId());

        //校验数据
        //重名
        if (checkNameRepeat(mediaTagGroup.getExtCorpId(), dto.getGroupId(), dto.getName())) {
            throw new BaseException("该标签名已存在");
        }

        Integer order = dto.getOrder() == null ? getMaxOrder(dto.getGroupId()) + 1: dto.getOrder();

        //封装数据
        MediaTag mediaTag = new MediaTag();
        BeanUtils.copyProperties(dto, mediaTag);
        mediaTag.setId(UUID.get32UUID()).setExtCorpId(mediaTagGroup.getExtCorpId())
                .setCreatorId(JwtUtil.getUserId()).setCreatedAt(new Date())
                .setUpdatedAt(new Date()).setOrder(order);

        save(mediaTag);
        return mediaTag;
    }

    /**
     * 获取最大编号
     * @param groupId
     * @return
     */
    private Integer getMaxOrder(String groupId) {
        return Optional.ofNullable(mediaTagMapper.findMaxOrder(groupId)).orElse(0);
    }

    //校验是否已有该名字的
    private boolean checkNameRepeat(String extCorpId, String groupId, String name) {
        return count(new QueryWrapper<MediaTag>().lambda()
                .eq(MediaTag::getExtCorpId, extCorpId)
                .eq(MediaTag::getGroupId, groupId)
                .eq(MediaTag::getName, name)) > 0;
    }

    /**
     * 翻译
     * @param mediaTag 实体
     * @return MediaTagVO 结果集
     * @author xxh
     * @date 2022-03-13
     */
    private MediaTagVO translation(MediaTag mediaTag){
        MediaTagVO vo = new MediaTagVO();
        BeanUtils.copyProperties(mediaTag, vo);
        return vo;
    }


    @Override
    public MediaTag checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        MediaTag byId = getById(id);
        if (byId == null) {
            throw new BaseException("（素材库）企业微信标签管理不存在");
        }
        return byId;
    }
}
