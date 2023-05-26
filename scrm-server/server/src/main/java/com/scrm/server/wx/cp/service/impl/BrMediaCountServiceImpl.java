package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxDynamicMedia;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrMediaCountQueryDTO;
import com.scrm.server.wx.cp.dto.BrMediaCountSaveDTO;
import com.scrm.server.wx.cp.dto.DynamicMediaCountDTO;
import com.scrm.server.wx.cp.entity.BrMediaCount;
import com.scrm.server.wx.cp.entity.BrMediaCountDetail;
import com.scrm.server.wx.cp.entity.BrMediaSay;
import com.scrm.server.wx.cp.entity.BrMediaSayGroup;
import com.scrm.server.wx.cp.mapper.BrMediaCountMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.vo.BrMediaCountVO;
import com.scrm.server.wx.cp.vo.BrMediaTodayCountVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 素材统计表 服务实现类
 * @author xxh
 * @since 2022-05-15
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrMediaCountServiceImpl extends ServiceImpl<BrMediaCountMapper, BrMediaCount> implements IBrMediaCountService {

    @Autowired
    private IMediaInfoService mediaInfoService;

    @Autowired
    private IBrMediaSayService mediaSayService;

    @Autowired
    private IBrMediaSayGroupService mediaSayGroupService;

    @Autowired
    private IWxDynamicMediaService dynamicMediaService;

    @Autowired
    private IBrMediaCountDetailService countDetailService;

    @Autowired
    private IStaffService staffService;

    @Override
    public List<BrMediaCountVO> sortCount(BrMediaCountQueryDTO dto){
        if (dto.getType().equals(BrMediaCountQueryDTO.TYPE_SEND)) {
            return sortSendCount(dto);
        }else if (dto.getType().equals(BrMediaCountQueryDTO.TYPE_LOOK)) {
            return sortLookCount(dto);
        }else{
            return new ArrayList<>();
        }
    }

    private List<BrMediaCountVO> sortLookCount(BrMediaCountQueryDTO dto) {
        List<DynamicMediaCountDTO> countRes = dynamicMediaService.countByMediaId(dto);
        return countRes.stream().map(e -> {
            BrMediaCountVO resVO = new BrMediaCountVO();
            resVO.setType(BrMediaCount.MEDIA_INFO)
                    .setId(UUID.get32UUID())
                    .setCount(e.getCountSum())
                    .setMediaInfo(mediaInfoService.findById(e.getMediaInfoId()));
            return resVO;
        }).collect(Collectors.toList());
    }

    private List<BrMediaCountVO> sortSendCount(BrMediaCountQueryDTO dto) {
        LambdaQueryWrapper<BrMediaCount> wrapper = new QueryWrapper<BrMediaCount>()
                .lambda().eq(BrMediaCount::getExtCorpId, dto.getExtCorpId())
                .ge(BrMediaCount::getDate, dto.getStartTime())
                .orderByDesc(BrMediaCount::getSendCount)
                .last("limit " + dto.getShowCount());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }

    @Override
    public void addSendCount(BrMediaCountSaveDTO dto){

        //如果是话术
        if (Objects.equals(BrMediaCount.MEDIA_SAY, dto.getType())) {
            mediaSayService.addSendCount(dto.getExtCorpId(), dto.getTypeId(), dto.getSendCount());
            //话术只统计企业话术，不统计个人话术
            BrMediaSay mediaSay = mediaSayService.checkExists(dto.getTypeId());
            BrMediaSayGroup sayGroup = mediaSayGroupService.checkExists(mediaSay.getGroupId());
            if (sayGroup.getHasPerson()) {
                return;
            }
        }

        dto.setToday(new Date());
        //查询今日有没有数据
        BrMediaCount todayCount = baseMapper.checkToday(dto);

        //新增今日的
        if (todayCount == null || todayCount.getId() == null) {
            todayCount = new BrMediaCount();
            BeanUtils.copyProperties(dto, todayCount);
            todayCount.setId(UUID.get32UUID())
                    .setCreateTime(new Date())
                    .setUpdateTime(new Date())
                    .setDate(new Date());

            save(todayCount);
        }else{
            todayCount.setSendCount(
                    Optional.ofNullable(todayCount.getSendCount()).orElse(0) + dto.getSendCount()
            );
            updateById(todayCount);
        }

        BrMediaCountDetail countDetail = new BrMediaCountDetail()
                .setId(UUID.get32UUID())
                .setType(dto.getType())
                .setTypeId(dto.getTypeId())
                .setSendCount(dto.getSendCount())
                .setExtCorpId(dto.getExtCorpId())
                .setExtStaffId(staffService.checkExists(JwtUtil.getUserId()).getExtId())
                .setExtCustomerId(dto.getExtCustomerId())
                .setCreateTime(new Date())
                .setUpdateTime(new Date());

        countDetailService.save(countDetail);

    }

    /**
     * 翻译
     * @param brMediaCount 实体
     * @return BrMediaCountVO 结果集
     * @author xxh
     * @date 2022-05-15
     */
    private BrMediaCountVO translation(BrMediaCount brMediaCount){
        BrMediaCountVO vo = new BrMediaCountVO();
        BeanUtils.copyProperties(brMediaCount, vo);

        vo.setCount(brMediaCount.getSendCount());
        if (Objects.equals(BrMediaCount.MEDIA_INFO, vo.getType())) {
            vo.setMediaInfo(mediaInfoService.findById(brMediaCount.getTypeId()));
        }
        if (Objects.equals(BrMediaCount.MEDIA_SAY, vo.getType())) {
            vo.setMediaSay(mediaSayService.findById(brMediaCount.getTypeId()));
            vo.setMediaSayGroup(mediaSayGroupService.checkExists(vo.getMediaSay().getGroupId()));
        }
        return vo;
    }


    @Override
    public BrMediaCount checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrMediaCount byId = getById(id);
        if (byId == null) {
            throw new BaseException("素材统计表不存在");
        }
        return byId;
    }

    @Override
    public BrMediaTodayCountVO getTodayCount() {
        //发送的
        Integer sendCount = baseMapper.sumByDate(JwtUtil.getExtCorpId(), new Date());
        //浏览的
        long count = dynamicMediaService.count(new QueryWrapper<WxDynamicMedia>().lambda()
                .eq(WxDynamicMedia::getExtCorpId, JwtUtil.getExtCorpId())
                .ge(WxDynamicMedia::getCreatedAt, DateUtils.getTodayDate()));

        BrMediaTodayCountVO result = new BrMediaTodayCountVO();
        result.setSendCount(Optional.ofNullable(sendCount).orElse(0));
        result.setLookCount((int) count);
        return result;
    }

    @Override
    public Integer countSendCount(int type, String typeId) {
        return baseMapper.countSendCount(type, typeId);
    }
}
