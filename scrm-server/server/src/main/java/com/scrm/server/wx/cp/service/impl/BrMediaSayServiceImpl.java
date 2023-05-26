package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.WxMsgAttachmentDTO;
import com.scrm.api.wx.cp.entity.MediaTag;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrMediaSayPageDTO;
import com.scrm.server.wx.cp.dto.BrMediaSaySaveDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayUpdateDTO;
import com.scrm.server.wx.cp.entity.BrMediaSay;
import com.scrm.server.wx.cp.entity.BrMediaSayTag;
import com.scrm.server.wx.cp.mapper.BrMediaSayMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import com.scrm.server.wx.cp.vo.BrMediaSayVO;
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
 * （素材库）企业话术 服务实现类
 * @author xxh
 * @since 2022-05-10
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrMediaSayServiceImpl extends ServiceImpl<BrMediaSayMapper, BrMediaSay> implements IBrMediaSayService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrMediaSayTagService mediaSayTagService;

    @Autowired
    private IMediaTagService tagService;

    @Autowired
    private IWxTempFileService fileService;

    @Override
    public IPage<BrMediaSayVO> pageList(BrMediaSayPageDTO dto){

        List<String> sayIds = null;
        if (ListUtils.isNotEmpty(dto.getTagList())) {
            sayIds = mediaSayTagService.findSayIdByTagId(dto.getExtCorpId(), dto.getTagList());
            if (ListUtils.isEmpty(sayIds)) {
                return new Page<>();
            }
        }

        LambdaQueryWrapper<BrMediaSay> wrapper = new QueryWrapper<BrMediaSay>()
        .lambda().in(ListUtils.isNotEmpty(sayIds), BrMediaSay::getId, sayIds)
                .eq(BrMediaSay::getExtCorpId, dto.getExtCorpId())
                .eq(BrMediaSay::getGroupId, dto.getGroupId())
                .like(StringUtils.isNotBlank(dto.getCode()), BrMediaSay::getTitle, dto.getCode())
                .orderByDesc(BrMediaSay::getUpdatedAt);
        IPage<BrMediaSay> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()),wrapper);
        return page.convert(this::translation);
    }

    @Override
    public BrMediaSayVO findById(String id){
        return translation(checkExists(id));
    }


    @Override
    public BrMediaSay save(BrMediaSaySaveDTO dto){

        //封装数据
        BrMediaSay brMediaSay = new BrMediaSay();
        BeanUtils.copyProperties(dto,brMediaSay);
        brMediaSay.setId(UUID.get32UUID());

        setTitle(brMediaSay);
        brMediaSay.setCreatorExtId(JwtUtil.getExtUserId())
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date());

        checkNameRepeat(brMediaSay);

        //入库
        save(brMediaSay);

        //标签入库
        saveTag(brMediaSay, dto.getTagIdList());
        return brMediaSay;
    }

    /**
     * 设置title字段
     * @param brMediaSay
     */
    private void setTitle(BrMediaSay brMediaSay) {
        try {
            brMediaSay.setTitle(WxMsgUtils.changeToText(brMediaSay.getMsg(), null).getContent());
        }catch (Exception e){
            log.error("企业话术，设置title出错，参数=[{}],", JSON.toJSONString(brMediaSay), e);
        }
    }

    private void saveTag(BrMediaSay brMediaSay, List<String> tagList){

        //标签入库，先删后增
        if (ListUtils.isNotEmpty(tagList)) {

            mediaSayTagService.deleteBySayId(brMediaSay.getExtCorpId(), null, brMediaSay.getId());

            List<BrMediaSayTag> sayTagList = tagList.stream().map(tagId ->
                    new BrMediaSayTag()
                            .setId(UUID.get32UUID())
                            .setSayId(brMediaSay.getId())
                            .setTagId(tagId)
                            .setExtCorpId(brMediaSay.getExtCorpId())
                            .setCreatedAt(new Date())
                            .setUpdatedAt(new Date())).collect(Collectors.toList());

            mediaSayTagService.saveBatch(sayTagList);
        }

    }

    @Override
    public BrMediaSay update(BrMediaSayUpdateDTO dto){

        //校验参数
        BrMediaSay old = checkExists(dto.getId());

        //封装数据
        BrMediaSay brMediaSay = new BrMediaSay();
        BeanUtils.copyProperties(old, brMediaSay);
        BeanUtils.copyProperties(dto, brMediaSay);

        setTitle(brMediaSay);
        brMediaSay.setUpdatedAt(new Date());

        checkNameRepeat(brMediaSay);

        //入库
        updateById(brMediaSay);

        saveTag(brMediaSay, dto.getTagIdList());

        return brMediaSay;
    }

    private void checkNameRepeat(BrMediaSay brMediaSay) {

        if (count(new QueryWrapper<BrMediaSay>().lambda()
                .eq(BrMediaSay::getExtCorpId, brMediaSay.getExtCorpId())
                .ne(BrMediaSay::getId, brMediaSay.getId())
                .eq(BrMediaSay::getName, brMediaSay.getName())) > 0) {
            throw new BaseException("该话术名已被使用");
        }

    }

    @Override
    public void batchDelete(BatchDTO<String> dto){

        //校验参数
        List<BrMediaSay> brMediaSayList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>())
                .forEach(id ->
                        brMediaSayList.add(checkExists(id)));

        //删除
        removeByIds(dto.getIds());

        //关联删标签
        mediaSayTagService.deleteBySayId(JwtUtil.getExtCorpId(), dto.getIds(), null);
    }


    /**
     * 翻译
     * @param brMediaSay 实体
     * @return BrMediaSayVO 结果集
     * @author xxh
     * @date 2022-05-10
     */
    private BrMediaSayVO translation(BrMediaSay brMediaSay){
        BrMediaSayVO vo = new BrMediaSayVO();
        BeanUtils.copyProperties(brMediaSay, vo);

        vo.setCreator(staffService.find(brMediaSay.getExtCorpId(), brMediaSay.getCreatorExtId()));

        //翻译标签
        List<BrMediaSayTag> list = mediaSayTagService.list(new QueryWrapper<BrMediaSayTag>().lambda()
                .eq(BrMediaSayTag::getExtCorpId, vo.getExtCorpId())
                .eq(BrMediaSayTag::getSayId, vo.getId()));

        if (ListUtils.isNotEmpty(list)) {

            List<String> tagIds = list.stream().map(BrMediaSayTag::getTagId).collect(Collectors.toList());
            List<MediaTag> mediaTags = tagService.listByIds(tagIds);
            vo.setTagList(mediaTags);

        }

        //翻译文件
        List<WxMsgAttachmentDTO> mediaList = vo.getMsg().getMedia();
        if (ListUtils.isNotEmpty(mediaList)) {
            mediaList.stream().filter(e -> e.getFile() != null
                    && StringUtils.isNotBlank(e.getFile().getId()))
                    .forEach(e -> e.setFile(fileService.checkExists(e.getFile().getId())));
        }
        return vo;
    }


    @Override
    public BrMediaSay checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrMediaSay byId = getById(id);
        if (byId == null) {
            throw new BaseException("（素材库）企业话术不存在");
        }
        return byId;
    }

    @Override
    public void addSendCount(String extCorpId, String sayId, Integer count) {

        BrMediaSay brMediaSay = checkExists(sayId);

        brMediaSay.setSendNum( Optional.ofNullable(brMediaSay.getSendNum()).orElse(0) + count);

        updateById(brMediaSay);

        //
    }
}
