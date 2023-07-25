package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.CustomerDynamicInfoDTO;
import com.scrm.api.wx.cp.entity.BrJourney;
import com.scrm.api.wx.cp.entity.BrJourneyStage;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicModelEnum;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicTypeEnum;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrJourneyStageCustomer;
import com.scrm.server.wx.cp.mapper.BrJourneyStageMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.vo.BrJourneyStageStatisticsInfoVO;
import com.scrm.server.wx.cp.vo.BrJourneyStageVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 旅程阶段 服务实现类
 *
 * @author xxh
 * @since 2022-04-06
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrJourneyStageServiceImpl extends ServiceImpl<BrJourneyStageMapper, BrJourneyStage> implements IBrJourneyStageService {

    @Autowired
    private IBrJourneyStageCustomerService journeyStageCustomerService;

    @Autowired
    private IBrJourneyService journeyService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrCustomerDynamicService customerDynamicService;

    @Autowired
    private IWxCustomerService customerService;

    @Override
    public IPage<BrJourneyStageVO> pageList(BrJourneyStagePageDTO dto) {
        LambdaQueryWrapper<BrJourneyStage> wrapper = new QueryWrapper<BrJourneyStage>().lambda()
                .eq(BrJourneyStage::getExtCorpId, dto.getExtCorpId())
                .eq(StringUtils.isNotBlank(dto.getJourneyId()), BrJourneyStage::getJourneyId, dto.getJourneyId())
                .like(StringUtils.isNotBlank(dto.getName()), BrJourneyStage::getName, dto.getName())
                .orderByAsc(BrJourneyStage::getSort);
        IPage<BrJourneyStage> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrJourneyStageVO> queryList(BrJourneyStageQueryDTO dto) {
        LambdaQueryWrapper<BrJourneyStage> wrapper = new QueryWrapper<BrJourneyStage>().lambda()
                .eq(BrJourneyStage::getExtCorpId, dto.getExtCorpId())
                .eq(StringUtils.isNotBlank(dto.getJourneyId()), BrJourneyStage::getJourneyId, dto.getJourneyId())
                .like(StringUtils.isNotBlank(dto.getName()), BrJourneyStage::getName, dto.getName())
                .orderByAsc(BrJourneyStage::getSort);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrJourneyStageVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrJourneyStage save(BrJourneyStageSaveDTO dto) {

        //校验数据
        checkRepeat(null, dto.getExtCorpId(),  dto.getName(),dto.getJourneyId());
        BrJourney brJourney = journeyService.checkExists(dto.getJourneyId());

        //校验数据
        long count = count(new LambdaQueryWrapper<BrJourneyStage>()
                .eq(BrJourneyStage::getExtCorpId, dto.getExtCorpId())
                .eq(BrJourneyStage::getJourneyId, dto.getJourneyId()));
        if (count > 9) {
            throw new BaseException(String.format("旅程【%s】下的阶段已达上限，最多能添加10个阶段", brJourney.getName()));
        }

        //封装数据
        BrJourneyStage brJourneyStage = new BrJourneyStage();
        BeanUtils.copyProperties(dto, brJourneyStage);
        Integer sort = baseMapper.getMaxSort(brJourney.getId());
        brJourneyStage.setId(UUID.get32UUID())
                .setUpdatedAt(new Date())
                .setCreatedAt(new Date())
                .setCreator(JwtUtil.getUserId())
                .setSort(sort+1);


        //入库
        save(brJourneyStage);

        return brJourneyStage;
    }


    /**
     * 校验重复
     *
     * @param id        id
     * @param extCorpId 企业id
     * @param name      名称
     * @param journeyId 阶段id
     * @author xuxh
     * @date 2022/4/6 19:49
     */
    private void checkRepeat(String id, String extCorpId, String name, String journeyId) {
        long count = count(new LambdaQueryWrapper<BrJourneyStage>()
                .eq(BrJourneyStage::getName, name)
                .eq(BrJourneyStage::getJourneyId, journeyId)
                .eq(BrJourneyStage::getExtCorpId, extCorpId));
        log.info("count is {}",count);
        if (OptionalLong.of(count).orElse(0) > 0) {
            throw new BaseException(String.format("阶段：【%s】已存在,请重命名", name));
        }
    }

    @Override
    public BrJourneyStage update(BrJourneyStageUpdateDTO dto) {

        //校验参数
        BrJourneyStage old = checkExists(dto.getId());
        //校验数据
        checkRepeat(null, dto.getExtCorpId(), dto.getName(), dto.getJourneyId());
        journeyService.checkExists(dto.getJourneyId());

        //封装数据
        BrJourneyStage brJourneyStage = new BrJourneyStage();
        BeanUtils.copyProperties(dto, brJourneyStage);
        brJourneyStage.setCreatedAt(old.getCreatedAt())
                .setCreator(old.getCreator())
                .setUpdatedAt(new Date())
                .setEditor(JwtUtil.getUserId());


        //入库
        updateById(brJourneyStage);

        return brJourneyStage;
    }


    @Override
    public void delete(String id) {

        if (StringUtils.isBlank(id)) {
            return;
        }

        batchDelete(new BatchDTO<String>().setIds(Collections.singletonList(id)));

    }

    @Override
    public void deleteByJourneyId(String journeyId) {

        if (StringUtils.isBlank(journeyId)) {
            return;
        }

        //删除
        removeById(journeyId);

        //删除阶段-客户关联
        journeyStageCustomerService.remove(new LambdaQueryWrapper<BrJourneyStageCustomer>().eq(BrJourneyStageCustomer::getJourneyId, journeyId));

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        if (ListUtils.isEmpty(dto.getIds())) {
            return;
        }

        //查询旅程是否还剩阶段
        List<String> journeyIds = new ArrayList<>();
        dto.getIds().forEach(id -> {
            BrJourneyStage brJourneyStage = checkExists(id);
            if (journeyStageCustomerService.queryList(new BrJourneyStageCustomerQueryDTO().setJourneyStageId(id)).size() > 0) {
                throw new BaseException(String.format("旅程阶段'%s'还存在客户,请先移除该旅程阶段的客户", brJourneyStage.getName()));
            }
            journeyIds.add(brJourneyStage.getJourneyId());
        });


        //批量删除阶段-客户关联
        ListUtils.execute(journeyStageIds -> journeyStageCustomerService.remove(new LambdaQueryWrapper<BrJourneyStageCustomer>().in(BrJourneyStageCustomer::getJourneyStageId, journeyStageIds)), dto.getIds(), 999);

        //删除
        removeByIds(dto.getIds());

        //删除没有阶段的旅程
        if (ListUtils.isNotEmpty(journeyIds)) {
            journeyIds.forEach(journeyId -> {
                if (count(new LambdaQueryWrapper<BrJourneyStage>().eq(BrJourneyStage::getJourneyId, journeyId)) == 0) {
                    journeyService.delete(journeyId);
                }
            });
        }
    }


    /**
     * 翻译
     *
     * @param brJourneyStage 实体
     * @return BrJourneyStageVO 结果集
     * @author xxh
     * @date 2022-04-06
     */
    private BrJourneyStageVO translation(BrJourneyStage brJourneyStage) {
        BrJourneyStageVO vo = new BrJourneyStageVO();
        BeanUtils.copyProperties(brJourneyStage, vo);
        vo.setCreatorStaff(staffService.find(brJourneyStage.getCreator()));
        return vo;
    }


    @Override
    public BrJourneyStage checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrJourneyStage byId = getById(id);
        if (byId == null) {
            throw new BaseException("旅程阶段不存在");
        }
        return byId;
    }

    @Override
    public BrJourneyStage moveAllCustomer(BrJourneyStageMoveAllCustomerDTO dto) {

        handleCustomerDynamic(dto);

        checkExists(dto.getSourceId());
        BrJourneyStage target = checkExists(dto.getTargetId());
        journeyStageCustomerService.update(new LambdaUpdateWrapper<BrJourneyStageCustomer>()
                .eq(BrJourneyStageCustomer::getExtCorpId, dto.getExtCorpId())
                .eq(BrJourneyStageCustomer::getJourneyStageId, dto.getSourceId())
                .set(BrJourneyStageCustomer::getJourneyId, target.getJourneyId())
                .set(BrJourneyStageCustomer::getJourneyStageId, target.getId())
        );
        return target;
    }

    @Override
    public List<BrJourneyStageStatisticsInfoVO> getStatisticsInfo(String extCorpId, String journeyId) {
        return baseMapper.getStatisticsInfo(extCorpId, journeyId);
    }

    private void handleCustomerDynamic(BrJourneyStageMoveAllCustomerDTO dto) {

        BrJourneyStage source = checkExists(dto.getSourceId());
        BrJourneyStage target = checkExists(dto.getTargetId());

        List<BrJourneyStageCustomer> stageCustomerList = journeyStageCustomerService.list(new QueryWrapper<BrJourneyStageCustomer>().lambda()
                .eq(BrJourneyStageCustomer::getExtCorpId, dto.getExtCorpId())
                .eq(BrJourneyStageCustomer::getJourneyStageId, dto.getSourceId())
        );

        if (ListUtils.isEmpty(stageCustomerList)) {
            return;
        }

        stageCustomerList.forEach(e -> {

            CustomerDynamicInfoDTO customerDynamicInfoDTO = new CustomerDynamicInfoDTO()
                    .setJourneyId(source.getJourneyId())
                    .setJourneyName(journeyService.checkExists(source.getJourneyId()).getName())
                    .setOldStageId(source.getJourneyId())
                    .setOldStageName(source.getName())
                    .setNewStageId(target.getId())
                    .setNewStageName(target.getName());

            customerDynamicService.save(BrCustomerDynamicModelEnum.CUSTOMER_STAGE.getCode(),
                    BrCustomerDynamicTypeEnum.STAGE_UPDATE.getCode(),
                    dto.getExtCorpId(),
                    JwtUtil.getExtUserId(),
                    e.getCustomerExtId(),
                    customerDynamicInfoDTO);

        });
    }

    public Integer getMaxSort(String journeyId) {
        return this.baseMapper.getMaxSort(journeyId);
    }
}
