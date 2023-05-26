package com.scrm.server.wx.cp.service.impl;

import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.BrJourneyStage;
import com.scrm.server.wx.cp.service.IBrJourneyStageService;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.vo.BrJourneyStageStatisticsInfoVO;
import com.scrm.server.wx.cp.vo.BrJourneyStatisticsInfoVO;
import lombok.extern.slf4j.Slf4j;
import com.scrm.api.wx.cp.entity.BrJourney;
import com.scrm.server.wx.cp.mapper.BrJourneyMapper;
import com.scrm.server.wx.cp.service.IBrJourneyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.server.wx.cp.vo.BrJourneyVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.*;

import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.stream.Collectors;

/**
 * 旅程信息 服务实现类
 *
 * @author xxh
 * @since 2022-04-06
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrJourneyServiceImpl extends ServiceImpl<BrJourneyMapper, BrJourney> implements IBrJourneyService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrJourneyStageService journeyStageService;

    @Override
    public IPage<BrJourneyVO> pageList(BrJourneyPageDTO dto) {
        LambdaQueryWrapper<BrJourney> wrapper = new QueryWrapper<BrJourney>().lambda()
                .eq(BrJourney::getExtCorpId, dto.getExtCorpId())
                .like(StringUtils.isNotBlank(dto.getName()), BrJourney::getName, dto.getName())
                .orderByAsc(BrJourney::getSort);
        IPage<BrJourney> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrJourneyVO> queryList(BrJourneyQueryDTO dto) {
        LambdaQueryWrapper<BrJourney> wrapper = new QueryWrapper<BrJourney>().lambda()
                .eq(BrJourney::getExtCorpId, dto.getExtCorpId())
                .like(StringUtils.isNotBlank(dto.getName()), BrJourney::getName, dto.getName())
                .orderByAsc(BrJourney::getSort);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrJourneyVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrJourney save(BrJourneySaveDTO dto) {


        //校验数据
        checkRepeat(null, dto.getName(), dto.getExtCorpId());

        //封装数据
        BrJourney brJourney = new BrJourney();
        BeanUtils.copyProperties(dto, brJourney);
        brJourney.setId(UUID.get32UUID())
                .setUpdatedAt(new Date())
                .setCreatedAt(new Date())
                .setCreator(JwtUtil.getUserId());

        //入库
        save(brJourney);

        //处理旅程阶段数据
        handlerJourneyStageList(brJourney, dto.getJourneyStageList());

        return brJourney;
    }

    /**
     * 新增/修改旅程阶段数据
     *
     * @param brJourney        旅程
     * @param journeyStageList 旅程阶段列表
     * @author xuxh
     * @date 2022/4/7 14:17
     */
    private void handlerJourneyStageList(BrJourney brJourney, List<BrJourneyStageSaveOrUpdateDTO> journeyStageList) {

        if (ListUtils.isEmpty(journeyStageList)) {
            return;
        }

        //校验数据
        if (journeyStageList.size() > 10) {
            throw new BaseException("添加阶段超过上限，一个旅程最多只能添加十个旅程阶段");
        }

        final Integer[] sort = {0};
        //1、遍历新增/修改旅程数据
        journeyStageList.forEach(journeyStage -> {
            sort[0] = sort[0] + 1;
            if (StringUtils.isNotBlank(journeyStage.getId())) {
                BrJourneyStageUpdateDTO journeyStageUpdateDTO = new BrJourneyStageUpdateDTO();
                BeanUtils.copyProperties(journeyStage, journeyStageUpdateDTO);
                journeyStageUpdateDTO.setExtCorpId(brJourney.getExtCorpId())
                        .setSort(sort[0])
                        .setJourneyId(brJourney.getId());
                journeyStageService.update(journeyStageUpdateDTO);
            } else {
                BrJourneyStageSaveDTO journeyStageSaveDTO = new BrJourneyStageSaveDTO();
                BeanUtils.copyProperties(journeyStage, journeyStageSaveDTO);
                journeyStageSaveDTO.setExtCorpId(brJourney.getExtCorpId())
                        .setSort(sort[0])
                        .setJourneyId(brJourney.getId());
                BrJourneyStage stage = journeyStageService.save(journeyStageSaveDTO);
                journeyStage.setId(stage.getId());
            }
        });


        //2、从数据库移除已被删除的数据
        String id = brJourney.getId();
        List<String> journeyStageIds = journeyStageList.stream().map(BrJourneyStageSaveOrUpdateDTO::getId).collect(Collectors.toList());
        List<String> needDeleteJourneyStageIds = Optional.ofNullable(journeyStageService.list(new LambdaQueryWrapper<BrJourneyStage>()
                .select(BrJourneyStage::getId)
                .eq(BrJourneyStage::getJourneyId, id)
                .notIn(ListUtils.isNotEmpty(journeyStageIds), BrJourneyStage::getId, journeyStageIds)
        )).orElse(new ArrayList<>()).stream().map(BrJourneyStage::getId).collect(Collectors.toList());
        journeyStageService.batchDelete(new BatchDTO<String>().setIds(needDeleteJourneyStageIds));

    }


    @Override
    public BrJourney update(BrJourneyUpdateDTO dto) {

        //校验参数
        BrJourney old = checkExists(dto.getId());
        checkRepeat(dto.getId(), dto.getName(), dto.getExtCorpId());

        //封装数据
        BrJourney brJourney = new BrJourney();
        BeanUtils.copyProperties(dto, brJourney);
        brJourney.setCreatedAt(old.getCreatedAt())
                .setCreator(old.getCreator())
                .setUpdatedAt(new Date())
                .setEditor(JwtUtil.getUserId());

        //入库
        updateById(brJourney);

        //处理旅程阶段数据
        handlerJourneyStageList(brJourney, dto.getJourneyStageList());

        return brJourney;
    }


    @Override
    public void delete(String id) {

        if (StringUtils.isBlank(id)) {
            return;
        }

        //校验参数
        BrJourney brJourney = checkExists(id);

        List<BrJourneyStageStatisticsInfoVO> statisticsInfoList = journeyStageService.getStatisticsInfo(brJourney.getExtCorpId(), brJourney.getId());
        Optional.ofNullable(statisticsInfoList).orElse(new ArrayList<>()).forEach(statisticsInfo -> {
            if (statisticsInfo.getCustomerNum() > 0) {
                throw new BaseException("该旅程还存在客户,不允许删除");
            }
        });

        //删除
        removeById(id);

        //删除旅程阶段
        journeyStageService.deleteByJourneyId(brJourney.getId());

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        if (ListUtils.isEmpty(dto.getIds())) {
            return;
        }

        //校验参数
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(this::checkExists);

        //批量删除阶段-客户关联
        List<BrJourneyStage> journeyStages = ListUtils.execute2List(ids -> journeyStageService.list(new LambdaQueryWrapper<BrJourneyStage>().select(BrJourneyStage::getId).in(BrJourneyStage::getJourneyId, ids)), dto.getIds(), 999);
        List<String> journeyStageIds = Optional.of(journeyStages).orElse(new ArrayList<>()).stream().map(BrJourneyStage::getId).collect(Collectors.toList());
        journeyStageService.batchDelete(new BatchDTO<String>().setIds(journeyStageIds));

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brJourney 实体
     * @return BrJourneyVO 结果集
     * @author xxh
     * @date 2022-04-06
     */
    private BrJourneyVO translation(BrJourney brJourney) {
        BrJourneyVO vo = new BrJourneyVO();
        BeanUtils.copyProperties(brJourney, vo);
        vo.setCreatorStaff(staffService.find(brJourney.getCreator()));
        return vo;
    }

    /**
     * 校验重复
     *
     * @param id        id
     * @param extCorpId 企业id
     * @param name      名称
     * @author xuxh
     * @date 2022/4/6 19:49
     */
    private void checkRepeat(String id, String extCorpId, String name) {
        if (OptionalLong.of(count(new LambdaQueryWrapper<BrJourney>()
                .ne(id != null, BrJourney::getId, id)
                .eq(BrJourney::getName, name)
                .eq(BrJourney::getExtCorpId, extCorpId))).orElse(0) > 0) {
            throw new BaseException(String.format("旅程：【%s】已存在,请重命名", name));
        }
    }

    @Override
    public BrJourney checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrJourney byId = getById(id);
        if (byId == null) {
            throw new BaseException("旅程信息不存在");
        }
        return byId;
    }

    @Override
    public List<BrJourneyStatisticsInfoVO> getStatistics(String extCorpId) {
        List<BrJourneyStatisticsInfoVO> list = new ArrayList<>();
        List<BrJourneyVO> brJourneyVOS = queryList(new BrJourneyQueryDTO().setExtCorpId(extCorpId));
        Optional.ofNullable(brJourneyVOS).orElse(new ArrayList<>()).forEach(brJourneyVO -> {
            BrJourneyStatisticsInfoVO journeyStatisticsInfoVO = new BrJourneyStatisticsInfoVO();
            BeanUtils.copyProperties(brJourneyVO, journeyStatisticsInfoVO);
            journeyStatisticsInfoVO.setStageList(journeyStageService.getStatisticsInfo(extCorpId, brJourneyVO.getId()));
            list.add(journeyStatisticsInfoVO);
        });
        return list;
    }
}
