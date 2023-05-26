package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.api.wx.cp.entity.*;
import com.scrm.server.wx.cp.service.IWxGroupChatTagService;
import lombok.extern.slf4j.Slf4j;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.server.wx.cp.mapper.WxGroupChatTagGroupMapper;
import com.scrm.server.wx.cp.service.IWxGroupChatTagGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.*;

import com.scrm.common.util.UUID;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.stream.Collectors;

import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupPageDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupSaveDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupUpdateDTO;

import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupQueryDTO;
import com.scrm.api.wx.cp.vo.WxGroupChatTagGroupVO;

/**
 * 客户群聊标签组 服务实现类
 *
 * @author xxh
 * @since 2022-02-22
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxGroupChatTagGroupServiceImpl extends ServiceImpl<WxGroupChatTagGroupMapper, WxGroupChatTagGroup> implements IWxGroupChatTagGroupService {

    @Autowired
    private IWxGroupChatTagService groupChatTagService;


    @Override
    public IPage<WxGroupChatTagGroupVO> pageList(WxGroupChatTagGroupPageDTO dto) {
        LambdaQueryWrapper<WxGroupChatTagGroup> wrapper = new QueryWrapper<WxGroupChatTagGroup>().lambda()
                .eq(WxGroupChatTagGroup::getExtCorpId, dto.getExtCorpId())
                .orderByDesc(WxGroupChatTagGroup::getCreatedAt);

        if (StringUtils.isNotBlank(dto.getKeyword())) {
            List<String> groupIds = Optional.ofNullable(groupChatTagService.list(new LambdaQueryWrapper<WxGroupChatTag>()
                            .select(WxGroupChatTag::getGroupChatTagGroupId)
                            .eq(WxGroupChatTag::getExtCorpId, dto.getExtCorpId())
                            .like(WxGroupChatTag::getName, dto.getKeyword())
                            .groupBy(WxGroupChatTag::getGroupChatTagGroupId)))
                    .orElse(new ArrayList<>()).stream().map(WxGroupChatTag::getGroupChatTagGroupId).distinct().collect(Collectors.toList());
            wrapper.and(queryWrapper -> queryWrapper.like(WxGroupChatTagGroup::getName, dto.getKeyword())
                    .or().in(ListUtils.isNotEmpty(groupIds), WxGroupChatTagGroup::getId, groupIds));

        }
        IPage<WxGroupChatTagGroup> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<WxGroupChatTagGroupVO> queryList(WxGroupChatTagGroupQueryDTO dto) {
        LambdaQueryWrapper<WxGroupChatTagGroup> wrapper = new QueryWrapper<WxGroupChatTagGroup>().lambda()
                .eq(WxGroupChatTagGroup::getExtCorpId, dto.getExtCorpId())
                .orderByDesc(WxGroupChatTagGroup::getOrder);

        if (StringUtils.isNotBlank(dto.getKeyword())) {
            List<String> groupIds = Optional.ofNullable(groupChatTagService.list(new LambdaQueryWrapper<WxGroupChatTag>()
                            .select(WxGroupChatTag::getGroupChatTagGroupId)
                            .eq(WxGroupChatTag::getExtCorpId, dto.getExtCorpId())
                            .like(WxGroupChatTag::getName, dto.getKeyword())
                            .groupBy(WxGroupChatTag::getGroupChatTagGroupId)))
                    .orElse(new ArrayList<>()).stream().map(WxGroupChatTag::getGroupChatTagGroupId).distinct().collect(Collectors.toList());
            wrapper.and(queryWrapper -> queryWrapper.like(WxGroupChatTagGroup::getName, dto.getKeyword())
                    .or().in(ListUtils.isNotEmpty(groupIds), WxGroupChatTagGroup::getId, groupIds));

        }
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public WxGroupChatTagGroupVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public WxGroupChatTagGroup save(WxGroupChatTagGroupSaveDTO dto) {

        //封装数据
        WxGroupChatTagGroup wxGroupChatTagGroup = new WxGroupChatTagGroup();
        BeanUtils.copyProperties(dto, wxGroupChatTagGroup);
        wxGroupChatTagGroup.setId(UUID.get32UUID())
                .setExtCorpId(dto.getExtCorpId())
                .setExtCreatorId(JwtUtil.getUserId())
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date())
                .setOrder(Optional.ofNullable(baseMapper.getMaxOrder(dto.getExtCorpId())).orElse(0) + 1L);

        //校重
        checkRepeat(wxGroupChatTagGroup);

        //标签组入库
        save(wxGroupChatTagGroup);

        //新增群标签
        List<WxGroupChatTagSaveDTO> tagList = dto.getTagList();
        Optional.ofNullable(tagList).orElse(new ArrayList<>()).forEach(tag -> {
            tag.setExtCorpId(dto.getExtCorpId()).setGroupChatTagGroupId(wxGroupChatTagGroup.getId());
            groupChatTagService.save(tag);
        });

        return wxGroupChatTagGroup;
    }

    /**
     * 校重
     *
     * @param wxGroupChatTagGroup 标签组
     */
    private void checkRepeat(WxGroupChatTagGroup wxGroupChatTagGroup) {
        if (count(new LambdaQueryWrapper<WxGroupChatTagGroup>()
                .eq(WxGroupChatTagGroup::getExtCorpId, wxGroupChatTagGroup.getExtCorpId())
                .eq(WxGroupChatTagGroup::getName, wxGroupChatTagGroup.getName())
                .ne(StringUtils.isNotBlank(wxGroupChatTagGroup.getId()), WxGroupChatTagGroup::getId, wxGroupChatTagGroup.getId())
        ) > 0) {
            throw new BaseException("标签组已存在");
        }
    }


    @Override
    public WxGroupChatTagGroup update(WxGroupChatTagGroupUpdateDTO dto) {

        //校验参数
        WxGroupChatTagGroup groupChatTagGroup = checkExists(dto.getId());
        groupChatTagGroup.setOrder(dto.getOrder())
                .setUpdatedAt(new Date())
                .setName(dto.getName());
        checkRepeat(groupChatTagGroup);

        //入库
        updateById(groupChatTagGroup);

        //删除的标签
        groupChatTagService.batchDelete(new BatchDTO<String>().setIds(dto.getDeleteTagIds()));

        //修改标签
        Optional.ofNullable(dto.getUpdateTags()).orElse(new ArrayList<>()).forEach(tag -> groupChatTagService.saveOrUpdate(tag.setExtCorpId(groupChatTagGroup.getExtCorpId()).setGroupChatTagGroupId(groupChatTagGroup.getId())));

        return groupChatTagGroup;
    }


    @Override
    public void delete(String id) {

        //校验参数
        WxGroupChatTagGroup wxGroupChatTagGroup = checkExists(id);

        //删除关联标签
        List<String> tagIds = Optional.ofNullable(groupChatTagService.list(new LambdaQueryWrapper<WxGroupChatTag>()
                        .select(WxGroupChatTag::getId)
                        .eq(WxGroupChatTag::getGroupChatTagGroupId, wxGroupChatTagGroup.getId()))).orElse(new ArrayList<>())
                .stream().map(WxGroupChatTag::getId).collect(Collectors.toList());
        groupChatTagService.batchDelete(new BatchDTO<String>().setIds(tagIds));

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        if (ListUtils.isEmpty(dto.getIds())) {
            return;
        }

        //校验参数
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> {

            WxGroupChatTagGroup groupChatTagGroup = checkExists(id);

            //删除关联标签
            List<String> tagIds = Optional.ofNullable(groupChatTagService.list(new LambdaQueryWrapper<WxGroupChatTag>()
                            .select(WxGroupChatTag::getId)
                            .eq(WxGroupChatTag::getGroupChatTagGroupId, groupChatTagGroup.getId()))).orElse(new ArrayList<>())
                    .stream().map(WxGroupChatTag::getId).collect(Collectors.toList());
            groupChatTagService.batchDelete(new BatchDTO<String>().setIds(tagIds));
        });

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param wxGroupChatTagGroup 实体
     * @return WxGroupChatTagGroupVO 结果集
     * @author xxh
     * @date 2022-02-22
     */
    private WxGroupChatTagGroupVO translation(WxGroupChatTagGroup wxGroupChatTagGroup) {
        WxGroupChatTagGroupVO vo = new WxGroupChatTagGroupVO();
        BeanUtils.copyProperties(wxGroupChatTagGroup, vo);
        vo.setTags(groupChatTagService.list(new LambdaQueryWrapper<WxGroupChatTag>()
                .eq(WxGroupChatTag::getExtCorpId, wxGroupChatTagGroup.getExtCorpId())
                .eq(WxGroupChatTag::getGroupChatTagGroupId, wxGroupChatTagGroup.getId())
                .orderByAsc(WxGroupChatTag::getOrder))
        );
        return vo;
    }


    @Override
    public WxGroupChatTagGroup checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxGroupChatTagGroup byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户群聊标签组不存在");
        }
        return byId;
    }
}
