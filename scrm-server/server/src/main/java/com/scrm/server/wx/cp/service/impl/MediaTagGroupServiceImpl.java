package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.MediaTag;
import com.scrm.api.wx.cp.entity.MediaTagGroup;
import com.scrm.server.wx.cp.mapper.MediaTagGroupMapper;
import com.scrm.server.wx.cp.service.IMediaTagGroupService;
import com.scrm.server.wx.cp.service.IMediaTagService;
import com.scrm.api.wx.cp.vo.MediaTagGroupVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * （素材库）企业微信标签组管理 服务实现类
 * @author xxh
 * @since 2022-03-13
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class MediaTagGroupServiceImpl extends ServiceImpl<MediaTagGroupMapper, MediaTagGroup> implements IMediaTagGroupService {

    @Autowired
    private IMediaTagService tagService;

    @Override
    public IPage<MediaTagGroupVO> pageList(MediaTagGroupPageDTO dto){
        LambdaQueryWrapper<MediaTagGroup> wrapper = new QueryWrapper<MediaTagGroup>().lambda()
                .eq(MediaTagGroup::getExtCorpId, dto.getExtCorpId())
                .orderByDesc(MediaTagGroup::getCreatedAt);

        if (StringUtils.isNotBlank(dto.getKeyword())) {
            List<String> groupIds = Optional.ofNullable(tagService.list(new LambdaQueryWrapper<MediaTag>()
                    .select(MediaTag::getGroupId)
                    .eq(MediaTag::getExtCorpId, dto.getExtCorpId())
                    .like(MediaTag::getName, dto.getKeyword())))
                    .orElse(new ArrayList<>()).stream().map(MediaTag::getGroupId).distinct().collect(Collectors.toList());
            wrapper.and(queryWrapper -> queryWrapper.like(MediaTagGroup::getName, dto.getKeyword())
                    .or().in(ListUtils.isNotEmpty(groupIds), MediaTagGroup::getId, groupIds));

        }

        IPage<MediaTagGroup> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public MediaTagGroupVO findById(String id){
        return translation(checkExists(id));
    }


    @Override
    public MediaTagGroup save(MediaTagGroupSaveDTO dto){

        //封装数据
        MediaTagGroup mediaTagGroup = new MediaTagGroup();
        BeanUtils.copyProperties(dto,mediaTagGroup);

        //校验重复
        checkRepeat(mediaTagGroup);

        mediaTagGroup.setId(UUID.get32UUID())
                .setCreatorId(JwtUtil.getUserId())
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date());

        //入库
        save(mediaTagGroup);

        //新增标签
        if (ListUtils.isNotEmpty(dto.getTagList())) {

            List<MediaTag> mediaTagList = new ArrayList<>(dto.getTagList().size());

            for (int i = 0; i < dto.getTagList().size(); i++) {

                MediaTag mediaTag = new MediaTag();
                BeanUtils.copyProperties(dto.getTagList().get(i), mediaTag);
                mediaTag.setId(UUID.get32UUID())
                        .setExtCorpId(mediaTagGroup.getExtCorpId())
                        .setOrder(i + 1)
                        .setGroupId(mediaTagGroup.getId())
                        .setCreatorId(JwtUtil.getUserId())
                        .setCreatedAt(new Date())
                        .setUpdatedAt(new Date());

                mediaTagList.add(mediaTag);
            }

            tagService.saveBatch(mediaTagList);
        }

        return mediaTagGroup;
    }

    private void checkRepeat(MediaTagGroup mediaTagGroup) {

        if (count(new QueryWrapper<MediaTagGroup>().lambda()
                .ne(StringUtils.isNotBlank(mediaTagGroup.getId()),
                        MediaTagGroup::getId, mediaTagGroup.getId())
                .eq(MediaTagGroup::getName, mediaTagGroup.getName())) > 0) {

            throw new BaseException("该标签组名已存在");

        }

    }


    @Override
    public MediaTagGroup update(MediaTagGroupUpdateDTO dto){

        MediaTagGroup mediaTagGroup = checkExists(dto.getId());
        mediaTagGroup.setUpdatedAt(new Date())
                .setName(dto.getName())
                .setDepartmentList(dto.getDepartmentList());
        checkRepeat(mediaTagGroup);

        updateById(mediaTagGroup);

        //删掉标签
        if (ListUtils.isNotEmpty(dto.getDeleteTagIds())) {

            tagService.remove(new QueryWrapper<MediaTag>().lambda()
                    .in(MediaTag::getId, dto.getDeleteTagIds())
                    .eq(MediaTag::getGroupId, dto.getId()));

        }

        //更新/新增标签
        if (ListUtils.isNotEmpty(dto.getUpdateTags())) {

            dto.getUpdateTags().forEach(
                    e -> {

                        if (e.getOrder() == null) {
                            throw new BaseException("排序不能为空");
                        }

                        if (StringUtils.isBlank(e.getId())) {
                            tagService.save(new MediaTagSaveDTO()
                                    .setGroupId(dto.getId())
                                    .setName(e.getName())
                                    .setOrder(e.getOrder()));
                        }else{

                            MediaTag mediaTag = tagService.checkExists(e.getId());
                            mediaTag.setUpdatedAt(new Date())
                                    .setName(e.getName())
                                    .setOrder(e.getOrder());
                            tagService.updateById(mediaTag);

                        }
                    }
            );

        }

        return mediaTagGroup;
    }


    @Override
    public void delete(String id){

        //校验参数
        MediaTagGroup mediaTagGroup = checkExists(id);

        //删除
        removeById(id);

        //删除标签
        tagService.remove(new QueryWrapper<MediaTag>()
                .lambda().eq(MediaTag::getGroupId, id));

    }

    /**
     * 翻译
     * @param mediaTagGroup 实体
     * @return MediaTagGroupVO 结果集
     * @author xxh
     * @date 2022-03-13
     */
    private MediaTagGroupVO translation(MediaTagGroup mediaTagGroup){
        MediaTagGroupVO vo = new MediaTagGroupVO();
        BeanUtils.copyProperties(mediaTagGroup, vo);
        vo.setTags(tagService.list(new LambdaQueryWrapper<MediaTag>()
                .eq(MediaTag::getExtCorpId, mediaTagGroup.getExtCorpId())
                .eq(MediaTag::getGroupId, mediaTagGroup.getId())
                .orderByDesc(MediaTag::getOrder))
        );
        return vo;
    }


    @Override
    public MediaTagGroup checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        MediaTagGroup byId = getById(id);
        if (byId == null) {
            throw new BaseException("（素材库）企业微信标签组管理不存在");
        }
        return byId;
    }
}
