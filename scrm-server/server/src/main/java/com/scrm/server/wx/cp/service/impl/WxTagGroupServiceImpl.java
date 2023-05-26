package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.google.common.collect.Interner;
import com.google.common.collect.Interners;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.WxTag;
import com.scrm.api.wx.cp.entity.WxTagGroup;
import com.scrm.api.wx.cp.vo.WxTagGroupVO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.exception.ErrorMsgEnum;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.mapper.WxTagGroupMapper;
import com.scrm.server.wx.cp.service.IWxTagGroupService;
import com.scrm.server.wx.cp.service.IWxTagService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxCpErrorMsgEnum;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalTagGroupInfo;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalTagGroupList;
import me.chanjar.weixin.cp.constant.WxCpConsts;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 企业微信标签组管理 服务实现类
 *
 * @author xxh
 * @since 2021-12-29
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxTagGroupServiceImpl extends ServiceImpl<WxTagGroupMapper, WxTagGroup> implements IWxTagGroupService {

    @Autowired
    private IWxTagService tagService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    private static final Interner<String> stringPool = Interners.newWeakInterner();

    private static final Object LOCK = new Object();


    @Override
    public IPage<WxTagGroupVO> pageList(WxTagGroupPageDTO dto) {

        LambdaQueryWrapper<WxTagGroup> wrapper = new QueryWrapper<WxTagGroup>().lambda()
                .eq(WxTagGroup::getExtCorpId, dto.getExtCorpId())
                .orderByDesc(WxTagGroup::getOrder)
                .orderByDesc(WxTagGroup::getCreatedAt);

        if (StringUtils.isNotBlank(dto.getKeyword())) {
            List<String> extGroupIds = Optional.ofNullable(tagService.list(new LambdaQueryWrapper<WxTag>()
                            .select(WxTag::getExtGroupId)
                            .eq(WxTag::getExtCorpId, dto.getExtCorpId())
                            .like(WxTag::getName, dto.getKeyword())
                            .groupBy(WxTag::getExtGroupId)))
                    .orElse(new ArrayList<>()).stream().map(WxTag::getExtGroupId).distinct().collect(Collectors.toList());
            wrapper.and(queryWrapper -> queryWrapper.like(WxTagGroup::getName, dto.getKeyword())
                    .or().in(ListUtils.isNotEmpty(extGroupIds), WxTagGroup::getExtId, extGroupIds));

        }

        IPage<WxTagGroup> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<WxTagGroupVO> queryList(WxTagGroupQueryDTO dto) {
        LambdaQueryWrapper<WxTagGroup> wrapper = new QueryWrapper<WxTagGroup>().lambda().eq(WxTagGroup::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public WxTagGroupVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public WxTagGroupVO save(WxTagGroupSaveDTO dto) throws WxErrorException {

        //封装数据
        WxTagGroup wxTagGroup = new WxTagGroup();
        BeanUtils.copyProperties(dto, wxTagGroup);
        wxTagGroup.setOrder(Optional.ofNullable(baseMapper.getMaxOrder(dto.getExtCorpId())).orElse(0) + 1L)
                .setType(WxTagGroup.TYPE_THIRD_PARTY);

        //校重
        checkRepeat(wxTagGroup);

        //调用企业微信API，新增标签组及标签
        WxCpUserExternalTagGroupInfo groupInfo = new WxCpUserExternalTagGroupInfo();
        WxCpUserExternalTagGroupInfo.TagGroup tagGroup = new WxCpUserExternalTagGroupInfo.TagGroup();
        groupInfo.setTagGroup(tagGroup);
        tagGroup.setGroupName(dto.getName());
        tagGroup.setOrder(wxTagGroup.getOrder());
        List<WxCpUserExternalTagGroupInfo.Tag> tags = new ArrayList<>();
        tagGroup.setTag(tags);
        for (WxTagSaveDTO wxTagSaveDTO : Optional.ofNullable(dto.getTagList()).orElse(new ArrayList<>())) {
            WxCpUserExternalTagGroupInfo.Tag wxTag = new WxCpUserExternalTagGroupInfo.Tag();
            wxTag.setName(wxTagSaveDTO.getName());
            wxTag.setOrder(wxTagSaveDTO.getOrder());
            tags.add(wxTag);
        }

        WxCpExternalContactServiceImpl wxCpExternalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        groupInfo = wxCpExternalContactService.addCorpTag(groupInfo);

        //封装数据
        tagGroup = groupInfo.getTagGroup();
        wxTagGroup.setId(UUID.get32UUID())
                .setOrder(tagGroup.getOrder())
                .setExtId(tagGroup.getGroupId())
                .setCreatedAt(new Date(tagGroup.getCreateTime() * 1000));
        tags = tagGroup.getTag();
        List<WxTag> wxTags = new ArrayList<>();
        Optional.ofNullable(tags).orElse(new ArrayList<>()).forEach(tag ->
                wxTags.add(new WxTag().setType(WxTag.TYPE_THIRD_PARTY)
                        .setId(UUID.get32UUID())
                        .setExtGroupId(wxTagGroup.getExtId())
                        .setExtCorpId(dto.getExtCorpId())
                        .setGroupName(wxTagGroup.getName())
                        .setName(tag.getName())
                        .setExtId(tag.getId())
                        .setCreatedAt(new Date())
                        .setOrder(tag.getOrder()))
        );

        //入库
        save(wxTagGroup.setId(UUID.get32UUID()));
        tagService.saveBatch(wxTags);

        return translation(wxTagGroup);
    }


    /**
     * 校重
     *
     * @param wxTagGroup 标签组
     */
    public void checkRepeat(WxTagGroup wxTagGroup) {
        if (count(new LambdaQueryWrapper<WxTagGroup>()
                .eq(WxTagGroup::getExtCorpId, wxTagGroup.getExtCorpId())
                .ne(StringUtils.isNotBlank(wxTagGroup.getId()), WxTagGroup::getId, wxTagGroup.getId())
                .and(wrapper -> wrapper.eq(StringUtils.isNotBlank(wxTagGroup.getExtId()), WxTagGroup::getExtId, wxTagGroup.getExtId()).or().eq(WxTagGroup::getName, wxTagGroup.getName()))
        ) > 0) {
            throw new BaseException("标签组已存在");
        }

    }

    @Override
    public WxTagGroup update(WxTagGroupUpdateDTO dto) throws WxErrorException {

        WxTagGroup wxTagGroup = checkExists(dto.getId());
        wxTagGroup.setUpdatedAt(new Date())
                .setName(dto.getName())
                .setDepartmentList(dto.getDepartmentList());
        checkRepeat(wxTagGroup);


        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());


        if (ListUtils.isNotEmpty(dto.getUpdateTags())) {

            //新增标签
            List<WxTagUpdateDTO> saveTags = dto.getUpdateTags().stream().filter(tagDTO -> StringUtils.isBlank(tagDTO.getId())).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(saveTags)) {
                WxCpUserExternalTagGroupInfo groupInfo = new WxCpUserExternalTagGroupInfo();
                WxCpUserExternalTagGroupInfo.TagGroup tagGroup = new WxCpUserExternalTagGroupInfo.TagGroup();
                tagGroup.setGroupId(wxTagGroup.getExtId());
                groupInfo.setTagGroup(tagGroup);
                List<WxCpUserExternalTagGroupInfo.Tag> tags = new ArrayList<>();
                tagGroup.setTag(tags);
                saveTags.forEach(tag -> {
                    WxCpUserExternalTagGroupInfo.Tag wxTag = new WxCpUserExternalTagGroupInfo.Tag();
                    wxTag.setName(tag.getName());
                    wxTag.setOrder(tag.getOrder());
                    tags.add(wxTag);
                });
                List<WxTag> wxTags = new ArrayList<>();
                externalContactService.addCorpTag(groupInfo).getTagGroup().getTag().forEach(tag ->
                        wxTags.add(new WxTag().setId(UUID.get32UUID())
                                .setName(tag.getName())
                                .setOrder(tag.getOrder())
                                .setExtId(tag.getId())
                                .setGroupId(wxTagGroup.getId())
                                .setExtCorpId(wxTagGroup.getExtCorpId())
                                .setExtGroupId(wxTagGroup.getExtId())
                                .setGroupName(wxTagGroup.getName())
                                .setType(WxTag.TYPE_THIRD_PARTY)
                                .setCreatedAt(new Date(tag.getCreateTime() * 1000))));
                tagService.saveBatch(wxTags);

            }

            //修改标签
            List<WxTagUpdateDTO> updateTags = dto.getUpdateTags().stream().filter(tagDTO -> StringUtils.isNotBlank(tagDTO.getId())).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(updateTags)) {
                for (WxTagUpdateDTO updateTag : updateTags) {
                    WxTag wxTag = tagService.checkExists(updateTag.getId());
                    wxTag.setOrder(updateTag.getOrder()).setUpdatedAt(new Date()).setName(updateTag.getName());
                    WxCpBaseResp wxCpBaseResp = externalContactService.editCorpTag(wxTag.getExtId(), updateTag.getName(), Integer.valueOf(updateTag.getOrder() + ""));
                    if (wxCpBaseResp.getErrcode() != WxCpErrorMsgEnum.CODE_0.getCode()) {
                        throw new BaseException(WxCpErrorMsgEnum.CODE_0.getCode(), WxCpErrorMsgEnum.CODE_0.getMsg());
                    }
                    tagService.updateById(wxTag);
                }
            }

        }

        //删除标签
        List<String> deleteTagIds = dto.getDeleteTagIds();

        try {
            if (ListUtils.isNotEmpty(deleteTagIds)) {
                List<String> tagExtIds = tagService.batchDelete(new BatchDTO<String>().setIds(deleteTagIds));
                if (ListUtils.isNotEmpty(tagExtIds)) {
                    externalContactService.delCorpTag(tagExtIds.toArray(new String[0]), null);
                }
            }
        } catch (WxErrorException wx) {
            //有可能在微信后台改数据已被删除
            if (ErrorMsgEnum.CODE_40068.getCode() != wx.getError().getErrorCode()) {
                throw wx;
            }
        }

        //调用企业微信API，修改标签组
        WxCpBaseResp wxCpBaseResp = externalContactService.editCorpTag(wxTagGroup.getExtId(), dto.getName(), Integer.valueOf(wxTagGroup.getOrder() + ""));
        if (wxCpBaseResp.getErrcode() != WxCpErrorMsgEnum.CODE_0.getCode()) {
            throw new BaseException(WxCpErrorMsgEnum.CODE_0.getCode(), WxCpErrorMsgEnum.CODE_0.getMsg());
        }

        //入库
        updateById(wxTagGroup);

        return wxTagGroup;
    }


    @Override
    public void delete(String id) throws WxErrorException {
        delete(id, true);
    }

    @Override
    public void delete(String id, boolean needRemoteDelete) throws WxErrorException {
        //校验参数
        WxTagGroup wxTagGroup = getById(id);
        if (wxTagGroup == null) {
            return;
        }

        List<WxTag> wxTags = Optional.ofNullable(tagService.list(new LambdaQueryWrapper<WxTag>()
                .eq(WxTag::getExtCorpId, wxTagGroup.getExtCorpId())
                .eq(WxTag::getExtGroupId, wxTagGroup.getExtId()))).orElse(new ArrayList<>());

        if (needRemoteDelete) {
            try {
                WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
                externalContactService.delCorpTag(wxTags.stream().map(WxTag::getExtId).toArray(String[]::new), new String[]{wxTagGroup.getExtId()});
            } catch (WxErrorException wx) {
                //有可能在微信后台改数据已被删除
                if (ErrorMsgEnum.CODE_40068.getCode() != wx.getError().getErrorCode()) {
                    throw wx;
                }
            }
        }

        //删除
        removeById(id);

        tagService.batchDelete(new BatchDTO<String>().setIds(wxTags.stream().map(WxTag::getId).collect(Collectors.toList())));
    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        if (ListUtils.isEmpty(dto.getIds())) {
            return;
        }

        //删除标签
        dto.getIds().forEach(id -> {
            List<String> tagIds = Optional.ofNullable(tagService.list(new LambdaQueryWrapper<WxTag>().eq(WxTag::getGroupId, id)))
                    .orElse(new ArrayList<>()).stream().map(WxTag::getId).collect(Collectors.toList());
            tagService.batchDelete(new BatchDTO<String>().setIds(tagIds));
        });

        //删除标签组
        removeByIds(dto.getIds());


    }

    /**
     * 翻译
     *
     * @param wxTagGroup 实体
     * @return WxTagGroupVO 结果集
     * @author xxh
     * @date 2021-12-29
     */
    private WxTagGroupVO translation(WxTagGroup wxTagGroup) {
        WxTagGroupVO vo = new WxTagGroupVO();
        BeanUtils.copyProperties(wxTagGroup, vo);
        vo.setTags(tagService.list(new LambdaQueryWrapper<WxTag>()
                .eq(WxTag::getExtCorpId, wxTagGroup.getExtCorpId())
                .eq(WxTag::getExtGroupId, wxTagGroup.getExtId())
                .orderByDesc(WxTag::getOrder)
                .orderByDesc(WxTag::getCreatedAt))
        );
        return vo;
    }


    @Override
    public WxTagGroup checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxTagGroup byId = getById(id);
        if (byId == null) {
            throw new BaseException("企业微信标签组不存在");
        }
        return byId;
    }

    /**
     * 同步
     *
     * @param tagGroupList 标签信息
     * @param extCorpId    企业ID
     * @param needDelete   是否需要刪除不存在的数据（如果是回调不需要）
     * @return java.lang.Boolean
     * @author xuxh
     * @date 2022/5/12 10:25
     */
    public Boolean sync(List<WxCpUserExternalTagGroupList.TagGroup> tagGroupList, String extCorpId, boolean needDelete) {
        List<String> tagGroupIds = new ArrayList<>();
        Map<String, List<String>> tagGroupExtIdAndTagExtIdsMap = new HashMap<>();
        Optional.ofNullable(tagGroupList).orElse(new ArrayList<>()).forEach(tagGroup -> {

            //新增/修改标签组
            WxTagGroup old = getOne(new LambdaQueryWrapper<WxTagGroup>()
                    .eq(WxTagGroup::getExtCorpId, extCorpId)
                    .eq(WxTagGroup::getExtId, tagGroup.getGroupId()));
            WxTagGroup wxTagGroup = new WxTagGroup();
            BeanUtils.copyProperties(Optional.ofNullable(old).orElse(new WxTagGroup()), wxTagGroup);
            wxTagGroup.setCreatedAt(new Date(tagGroup.getCreateTime() * 1000))
                    .setExtId(tagGroup.getGroupId())
                    .setName(tagGroup.getGroupName())
                    .setExtCorpId(extCorpId)
                    .setOrder(tagGroup.getOrder());

            if (old == null) {
                wxTagGroup.setId(UUID.get32UUID())
                        .setType(WxTagGroup.TYPE_CP_BACKGROUND);
                save(wxTagGroup);
            } else {
                wxTagGroup.setExtCreatorId(old.getExtCreatorId())
                        .setDepartmentList(old.getDepartmentList());
                updateById(wxTagGroup);
            }

            tagGroupIds.add(wxTagGroup.getId());

            //新增/修改标签
            List<WxCpUserExternalTagGroupList.TagGroup.Tag> tags = tagGroup.getTag();
            Optional.ofNullable(tags).orElse(new ArrayList<>()).forEach(tag -> {
                WxTag oldTag = tagService.getOne(new LambdaQueryWrapper<WxTag>()
                        .eq(WxTag::getExtCorpId, extCorpId)
                        .eq(WxTag::getExtGroupId, wxTagGroup.getExtId())
                        .eq(WxTag::getExtId, tag.getId())
                );
                WxTag wxTag = new WxTag();
                BeanUtils.copyProperties(Optional.ofNullable(oldTag).orElse(new WxTag()), wxTag);
                wxTag.setCreatedAt(new Date(tag.getCreateTime() * 1000))
                        .setGroupId(wxTagGroup.getId())
                        .setExtId(tag.getId())
                        .setName(tag.getName())
                        .setExtCorpId(extCorpId)
                        .setGroupName(wxTagGroup.getName())
                        .setExtGroupId(wxTagGroup.getExtId())
                        .setOrder(tag.getOrder());

                if (oldTag == null) {
                    log.info("进入同步标签，企业ID：【{}】,新增标签：【{}】", extCorpId, wxTag);
                    wxTag.setId(UUID.get32UUID()).setType(WxTag.TYPE_CP_BACKGROUND);
                    tagService.save(wxTag);
                } else {
                    wxTag.setExtCreatorId(oldTag.getExtCreatorId());
                    tagService.updateById(wxTag);
                    log.info("进入同步标签，企业ID：【{}】,修改标签：【{}】", extCorpId, wxTag);
                }
                List<String> list = Optional.ofNullable(tagGroupExtIdAndTagExtIdsMap.get(wxTagGroup.getExtId())).orElse(new ArrayList<>());
                list.add(tag.getId());
                tagGroupExtIdAndTagExtIdsMap.put(wxTagGroup.getExtId(), list);
            });

        });

        if (needDelete) {
            //移除不存在的标签组
            List<String> exitTagGroupIds = Optional.ofNullable(
                    list(new LambdaQueryWrapper<WxTagGroup>()
                            .select(WxTagGroup::getId)
                            .eq(WxTagGroup::getExtCorpId, extCorpId))
            ).orElse(new ArrayList<>()).stream().map(WxTagGroup::getId).collect(Collectors.toList());
            exitTagGroupIds.removeAll(tagGroupIds);

            //移除不存在的标签
            List<String> needDeleteTagIds = new ArrayList<>();
            tagGroupExtIdAndTagExtIdsMap.forEach((key, value) -> {
                List<String> tagIds = Optional.ofNullable(tagService.list(new LambdaQueryWrapper<WxTag>()
                                .select(WxTag::getId)
                                .eq(WxTag::getExtCorpId, extCorpId)
                                .eq(WxTag::getExtGroupId, key)
                                .notIn(WxTag::getExtId, value))).orElse(new ArrayList<>()).stream()
                        .map(WxTag::getId).collect(Collectors.toList());
                if (ListUtils.isNotEmpty(tagIds)) {
                    needDeleteTagIds.addAll(tagIds);
                }
            });
            tagService.batchDelete(new BatchDTO<String>().setIds(needDeleteTagIds));
            batchDelete(new BatchDTO<String>().setIds(exitTagGroupIds));
        }

        return true;
    }


    @Override
    public Boolean sync(String extCorpId) throws WxErrorException {
        log.info("进入同步标签，企业ID：【{}】,时间：【{}】", extCorpId, System.currentTimeMillis());
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        WxCpUserExternalTagGroupList corpTagList = externalContactService.getCorpTagList(null);
        List<WxCpUserExternalTagGroupList.TagGroup> tagGroupList = corpTagList.getTagGroupList();
        return sync(tagGroupList, extCorpId, true);
    }


    @Override
    public Boolean sync(String extCorpId, String extId, String tagType) throws WxErrorException {
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        String[] tagExtIs = null;
        String[] tagGroupExtIs;
        WxCpUserExternalTagGroupList corpTagList = null;
        if (WxCpConsts.TageType.TAG.equals(tagType)) {
            tagExtIs = new String[]{extId};
            corpTagList = externalContactService.getCorpTagList(tagExtIs);
        } else if (WxCpConsts.TageType.TAG_GROUP.equals(tagType)) {
            tagGroupExtIs = new String[]{extId};
            corpTagList = externalContactService.getCorpTagList(tagExtIs, tagGroupExtIs);
        }

        List<WxCpUserExternalTagGroupList.TagGroup> tagGroupList = corpTagList.getTagGroupList();
        return sync(tagGroupList, extCorpId, false);
    }


}
