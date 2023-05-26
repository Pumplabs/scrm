package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.entity.WxGroupChatTag;
import com.scrm.api.wx.cp.entity.WxGroupChatTagGroup;
import com.scrm.api.wx.cp.entity.WxGroupChatTagMap;
import com.scrm.api.wx.cp.vo.WxGroupChatTagVO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.mapper.WxGroupChatTagMapper;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import com.scrm.server.wx.cp.service.IWxGroupChatTagGroupService;
import com.scrm.server.wx.cp.service.IWxGroupChatTagMapService;
import com.scrm.server.wx.cp.service.IWxGroupChatTagService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 客户群聊标签 服务实现类
 *
 * @author xxh
 * @since 2022-02-22
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxGroupChatTagServiceImpl extends ServiceImpl<WxGroupChatTagMapper, WxGroupChatTag> implements IWxGroupChatTagService {

    @Autowired
    private IWxGroupChatTagGroupService groupChatTagGroupService;

    @Autowired
    private IWxGroupChatTagMapService groupChatTagMapService;

    @Autowired
    private IWxGroupChatService groupChatService;

    @Override
    public IPage<WxGroupChatTagVO> pageList(WxGroupChatTagPageDTO dto) {
        LambdaQueryWrapper<WxGroupChatTag> wrapper = new LambdaQueryWrapper<WxGroupChatTag>()
                .eq(StringUtils.isNotBlank(dto.getGroupChatTagGroupId()), WxGroupChatTag::getGroupChatTagGroupId, dto.getGroupChatTagGroupId())
                .eq(StringUtils.isNotBlank(dto.getName()), WxGroupChatTag::getName, dto.getName())
                .orderByDesc(WxGroupChatTag::getOrder)
                .orderByAsc(WxGroupChatTag::getCreatedAt);
        IPage<WxGroupChatTag> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<WxGroupChatTagVO> queryList(WxGroupChatTagQueryDTO dto) {
        LambdaQueryWrapper<WxGroupChatTag> wrapper = new QueryWrapper<WxGroupChatTag>().lambda();
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public WxGroupChatTagVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public WxGroupChatTag save(WxGroupChatTagSaveDTO dto) {

        //封装数据
        WxGroupChatTag wxGroupChatTag = new WxGroupChatTag();
        BeanUtils.copyProperties(dto, wxGroupChatTag);
        wxGroupChatTag.setId(UUID.get32UUID())
                .setExtCorpId(dto.getExtCorpId())
                .setCreatedAt(new Date())
                .setExtCreatorId(JwtUtil.getUserId());

        //校验参数
        checkRepeat(wxGroupChatTag);

        //入库
        wxGroupChatTag.setOrder(Optional.ofNullable(baseMapper.getMaxOrder(dto.getExtCorpId(), dto.getGroupChatTagGroupId())).orElse(0L) + 1);
        save(wxGroupChatTag);

        return wxGroupChatTag;
    }

    @Override
    public WxGroupChatTag saveOrUpdate(WxGroupChatTagUpdateDTO dto) {
        if (dto.getId() == null) {
            WxGroupChatTagSaveDTO groupChatTagSaveDTO = new WxGroupChatTagSaveDTO();
            BeanUtils.copyProperties(dto, groupChatTagSaveDTO);
            return save(groupChatTagSaveDTO);
        } else {
            WxGroupChatTag old = checkExists(dto.getId());
            //封装数据
            WxGroupChatTag wxGroupChatTag = new WxGroupChatTag();
            BeanUtils.copyProperties(dto, wxGroupChatTag);
            checkRepeat(wxGroupChatTag);
            wxGroupChatTag.setCreatedAt(old.getCreatedAt()).setUpdatedAt(new Date());
            updateById(wxGroupChatTag);
            return wxGroupChatTag;
        }

    }


    /**
     * 校重
     *
     * @param wxGroupChatTag 群聊标签
     * @author xuxh
     * @date 2022/2/23 15:18
     */
    private void checkRepeat(WxGroupChatTag wxGroupChatTag) {
        if (count(new LambdaQueryWrapper<WxGroupChatTag>()
                .eq(WxGroupChatTag::getExtCorpId, wxGroupChatTag.getExtCorpId())
                .eq(WxGroupChatTag::getGroupChatTagGroupId, wxGroupChatTag.getGroupChatTagGroupId())
                .eq(WxGroupChatTag::getName, wxGroupChatTag.getName())
                .ne(StringUtils.isNotBlank(wxGroupChatTag.getId()), WxGroupChatTag::getId, wxGroupChatTag.getId())
        ) > 0) {
            throw new BaseException("该群聊标签已存在");
        }
    }


    @Override
    public void delete(String id) {

        //校验参数
        WxGroupChatTag wxGroupChatTag = checkExists(id);
        if (OptionalInt.of((int) groupChatTagMapService.count(new LambdaQueryWrapper<WxGroupChatTagMap>()
                .eq(WxGroupChatTagMap::getGroupChatTagId, wxGroupChatTag.getId()))).orElse(0) > 1) {
            throw new BaseException(String.format("‘%s’标签下还存在客户群聊组，请解除关联再进行删除操作", wxGroupChatTag.getName()));
        }

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
            WxGroupChatTag wxGroupChatTag = checkExists(id);
            if (OptionalInt.of((int) groupChatTagMapService.count(new LambdaQueryWrapper<WxGroupChatTagMap>()
                    .eq(WxGroupChatTagMap::getGroupChatTagId, wxGroupChatTag.getId()))).orElse(0) > 1) {
                throw new BaseException(String.format("‘%s’标签下还存在客户群聊组，请解除关联再进行删除操作", wxGroupChatTag.getName()));
            }
        });

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param wxGroupChatTag 实体
     * @return WxGroupChatTagVO 结果集
     * @author xxh
     * @date 2022-02-22
     */
    private WxGroupChatTagVO translation(WxGroupChatTag wxGroupChatTag) {
        WxGroupChatTagVO vo = new WxGroupChatTagVO();
        BeanUtils.copyProperties(wxGroupChatTag, vo);
        return vo;
    }


    @Override
    public WxGroupChatTag checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxGroupChatTag byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户群聊标签不存在");
        }
        return byId;
    }

    @Override
    public void batchMarking(WxGroupChatTagBatchMarkingDTO dto) {

        //校验参数
        Optional.ofNullable(dto.getTagIds()).orElse(new ArrayList<>()).forEach(this::checkExists);
        List<WxGroupChat> wxGroupChats = Optional.ofNullable(dto.getGroupChatExtIds()).orElse(new ArrayList<>()).stream().distinct()
                .map(extId -> groupChatService.checkExists( dto.getExtCorpId(),extId))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        if (wxGroupChats.size() != dto.getGroupChatExtIds().size()) {
            throw new BaseException("所选客户群聊不存在");
        }

        //处理关联
        wxGroupChats.forEach(groupChat -> {
                    //先删除所有关联关系
                    groupChatTagMapService.remove(new LambdaQueryWrapper<WxGroupChatTagMap>().eq(WxGroupChatTagMap::getGroupChatId, groupChat.getId()));

                    //构建关联关系
                    Optional.ofNullable(dto.getTagIds()).orElse(new ArrayList<>()).forEach(tagId -> groupChatTagMapService.save(new WxGroupChatTagMap().setGroupChatId(groupChat.getId()).setGroupChatTagId(tagId)));
                }
        );

    }
}
