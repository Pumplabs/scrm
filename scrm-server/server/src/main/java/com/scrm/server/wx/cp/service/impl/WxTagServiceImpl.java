package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.common.exception.ErrorMsgEnum;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.common.dto.BatchDTO;
import com.scrm.api.wx.cp.dto.WxTagDTO;
import com.scrm.api.wx.cp.dto.WxTagPageDTO;
import com.scrm.api.wx.cp.dto.WxTagQueryDTO;
import com.scrm.api.wx.cp.entity.WxCustomerStaffTag;
import com.scrm.api.wx.cp.entity.WxTag;
import com.scrm.api.wx.cp.entity.WxTagGroup;
import com.scrm.server.wx.cp.mapper.WxTagMapper;
import com.scrm.server.wx.cp.service.IWxCustomerStaffTagService;
import com.scrm.server.wx.cp.service.IWxTagGroupService;
import com.scrm.server.wx.cp.service.IWxTagService;
import com.scrm.api.wx.cp.vo.WxTagVO;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.WxCpUserExternalTagGroupInfo;
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
 * 企业微信标签管理 服务实现类
 *
 * @author xxh
 * @since 2021-12-29
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxTagServiceImpl extends ServiceImpl<WxTagMapper, WxTag> implements IWxTagService {

    @Autowired
    private IWxTagGroupService tagGroupService;

    @Autowired
    private IWxCustomerStaffTagService staffTagService;

    @Override
    public IPage<WxTagVO> pageList(WxTagPageDTO dto) {
        LambdaQueryWrapper<WxTag> wrapper = new QueryWrapper<WxTag>().lambda();
        IPage<WxTag> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<WxTagVO> queryList(WxTagQueryDTO dto) {
        LambdaQueryWrapper<WxTag> wrapper = new QueryWrapper<WxTag>().lambda();
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public WxTagVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public WxTag save(WxTagDTO dto) throws WxErrorException {

        //封装数据
        WxTag wxTag = new WxTag();
        BeanUtils.copyProperties(dto, wxTag);
        wxTag.setId(UUID.get32UUID());

        //校验数据
        WxTagGroup wxTagGroup = tagGroupService.checkExists(dto.getTagGroupId());

        //企业微信新增标签
        Long maxOrder = Optional.ofNullable(baseMapper.getMaxOrder(wxTagGroup.getExtId())).orElse(0L) + 1;
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        WxCpUserExternalTagGroupInfo groupInfo = new WxCpUserExternalTagGroupInfo();
        WxCpUserExternalTagGroupInfo.TagGroup tagGroup = new WxCpUserExternalTagGroupInfo.TagGroup();
        tagGroup.setGroupId(wxTagGroup.getExtId());
        groupInfo.setTagGroup(tagGroup);
        List<WxCpUserExternalTagGroupInfo.Tag> tags = new ArrayList<>();
        WxCpUserExternalTagGroupInfo.Tag tag = new WxCpUserExternalTagGroupInfo.Tag();
        tag.setName(dto.getName());
        tag.setOrder(maxOrder);
        tags.add(tag);
        tagGroup.setTag(tags);
        groupInfo = externalContactService.addCorpTag(groupInfo);
        tag = groupInfo.getTagGroup().getTag().get(0);

        //入库
        save(wxTag.setOrder(tag.getOrder())
                .setCreatedAt(new Date())
                .setExtCorpId(wxTagGroup.getExtCorpId())
                .setGroupName(wxTagGroup.getName())
                .setExtGroupId(wxTagGroup.getExtId())
                .setExtId(tag.getId())
        );

        return wxTag;
    }


    @Override
    public void delete(String id) throws WxErrorException {
        delete(id, true);
    }

    @Override
    public void delete(String id, boolean needRemoteDelete) throws WxErrorException {

        //校验参数
        WxTag wxTag = getById(id);
        if (wxTag == null) {
            return;
        }

        //删除标签
        removeById(id);

        //删除客户标签关联
        staffTagService.remove(new LambdaQueryWrapper<WxCustomerStaffTag>()
                .eq(WxCustomerStaffTag::getExtCorpId, wxTag.getExtCorpId())
                .eq(WxCustomerStaffTag::getExtTagId, wxTag.getExtId()));

        if (needRemoteDelete) {
            try {
                WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
                externalContactService.delCorpTag(new String[]{wxTag.getExtId()}, new String[]{});
            } catch (WxErrorException wx) {
                //有可能在微信后台改数据已被删除
                if (ErrorMsgEnum.CODE_40068.getCode() != wx.getError().getErrorCode()) {
                    throw wx;
                }
            }
        }

    }


    @Override
    public List<String> batchDelete(BatchDTO<String> dto) {

        if (ListUtils.isEmpty(dto.getIds())) {
            return new ArrayList<>();
        }

        List<WxTag> wxTagList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> {

            //校验参数
            WxTag wxTag = getById(id);
            if (wxTag == null) {
                return;
            }

            wxTagList.add(wxTag);

            //删除客户标签关联
            staffTagService.remove(new LambdaQueryWrapper<WxCustomerStaffTag>()
                    .eq(WxCustomerStaffTag::getExtCorpId, wxTag.getExtCorpId())
                    .eq(WxCustomerStaffTag::getExtTagId, wxTag.getExtId()));

            //删除标签
            removeById(id);
        });

        return wxTagList.stream().map(WxTag::getExtId).collect(Collectors.toList());
    }


    /**
     * 翻译
     *
     * @param wxTag 实体
     * @return WxTagVO 结果集
     * @author xxh
     * @date 2021-12-29
     */
    private WxTagVO translation(WxTag wxTag) {
        WxTagVO vo = new WxTagVO();
        BeanUtils.copyProperties(wxTag, vo);
        return vo;
    }


    @Override
    public WxTag checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxTag byId = getById(id);

        if (byId == null) {
            throw new BaseException("企业微信标签不存在");
        }
        return byId;
    }

    @Override
    public WxTag checkExists(String extCorpId, String extId) {
        return getOne(new QueryWrapper<WxTag>().lambda()
                .eq(WxTag::getExtCorpId, extCorpId)
                .eq(WxTag::getExtId, extId), false);
    }

    @Override
    public List<String> getNameByIds(List<String> ids) {

        if (ListUtils.isEmpty(ids)) {
            return null;
        }

        List<WxTag> wxTags = listByIds(ids);
        return wxTags.stream().map(WxTag::getName).collect(Collectors.toList());
    }


}
