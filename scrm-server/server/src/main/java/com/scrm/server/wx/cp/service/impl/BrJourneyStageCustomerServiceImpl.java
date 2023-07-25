package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.CustomerDynamicInfoDTO;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicModelEnum;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicTypeEnum;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.BrJourneyStage;
import com.scrm.server.wx.cp.entity.BrJourneyStageCustomer;
import com.scrm.server.wx.cp.mapper.BrJourneyStageCustomerMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.vo.BrJourneyStageCustomerVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 旅程阶段-客户关联 服务实现类
 *
 * @author xxh
 * @since 2022-04-06
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrJourneyStageCustomerServiceImpl extends ServiceImpl<BrJourneyStageCustomerMapper, BrJourneyStageCustomer> implements IBrJourneyStageCustomerService {

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IBrJourneyStageService journeyStageService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrCustomerDynamicService customerDynamicService;

    @Autowired
    private IBrJourneyService journeyService;

    @Override
    public IPage<BrJourneyStageCustomerVO> pageList(BrJourneyStageCustomerPageDTO dto) {
        return baseMapper.pageList(new Page<>(dto.getPageNum(), dto.getPageSize()), dto).convert(this::translation);
    }


    @Override
    public List<BrJourneyStageCustomerVO> queryList(BrJourneyStageCustomerQueryDTO dto) {
        return Optional.ofNullable(baseMapper.queryList(dto)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrJourneyStageCustomerVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrJourneyStageCustomer save(BrJourneyStageCustomerSaveDTO dto) {

        //校验参数
        BrJourneyStage brJourneyStage = journeyStageService.checkExists(dto.getJourneyStageId());
        WxCustomer customer = customerService.checkExists(dto.getCustomerId());

        //封装数据
        BrJourneyStageCustomer brJourneyStageCustomer = new BrJourneyStageCustomer();
        BeanUtils.copyProperties(dto, brJourneyStageCustomer);
        brJourneyStageCustomer.setId(UUID.get32UUID())
                .setCustomerExtId(customer.getExtId())
                .setJourneyId(brJourneyStage.getJourneyId())
                .setCreatedAt(new Date())
                .setCreator(JwtUtil.getUserId());

        //校重
        checkRepeat(brJourneyStageCustomer);

        //入库
        save(brJourneyStageCustomer);

        //客户动态
        CustomerDynamicInfoDTO customerDynamicInfoDTO = new CustomerDynamicInfoDTO()
                .setJourneyId(brJourneyStage.getJourneyId())
                .setJourneyName(journeyService.checkExists(brJourneyStage.getJourneyId()).getName())
                .setNewStageId(brJourneyStage.getId())
                .setNewStageName(brJourneyStage.getName());
        customerDynamicService.save(BrCustomerDynamicModelEnum.CUSTOMER_STAGE.getCode(),
                BrCustomerDynamicTypeEnum.STAGE_ADD.getCode(),
                dto.getExtCorpId(), JwtUtil.getExtUserId(),
                customer.getExtId(), customerDynamicInfoDTO);
        return brJourneyStageCustomer;
    }

    private void checkRepeat(BrJourneyStageCustomer brJourneyStageCustomer) {

        if (OptionalLong.of(count(new LambdaQueryWrapper<BrJourneyStageCustomer>()
                .ne(brJourneyStageCustomer.getId() != null, BrJourneyStageCustomer::getId, brJourneyStageCustomer.getId())
                .eq(BrJourneyStageCustomer::getJourneyId, brJourneyStageCustomer.getJourneyId())
                .eq(BrJourneyStageCustomer::getExtCorpId, brJourneyStageCustomer.getExtCorpId())
                .eq(BrJourneyStageCustomer::getCustomerExtId, brJourneyStageCustomer.getCustomerExtId()))).orElse(0) > 0) {
            throw new BaseException("该客户在该旅程中，请勿重复添加");
        }

        if (OptionalLong.of(count(new LambdaQueryWrapper<BrJourneyStageCustomer>()
                .ne(brJourneyStageCustomer.getId() != null, BrJourneyStageCustomer::getId, brJourneyStageCustomer.getId())
                .eq(BrJourneyStageCustomer::getJourneyStageId, brJourneyStageCustomer.getJourneyStageId())
                .eq(BrJourneyStageCustomer::getExtCorpId, brJourneyStageCustomer.getExtCorpId())
                .eq(BrJourneyStageCustomer::getCustomerExtId, brJourneyStageCustomer.getCustomerExtId()))).orElse(0) > 0) {
            throw new BaseException("该客户已存在该阶段中，请勿重复添加");
        }

    }


    @Override
    public BrJourneyStageCustomer update(BrJourneyStageCustomerUpdateDTO dto) {

        //校验参数
        BrJourneyStage brJourneyStage = journeyStageService.checkExists(dto.getJourneyStageId());
        WxCustomer customer = customerService.checkExists(dto.getCustomerId());
        BrJourneyStageCustomer old;
        if (StringUtils.isNotBlank(dto.getId())) {
            old = checkExists(dto.getId());
        } else {
            old = getOne(new LambdaQueryWrapper<BrJourneyStageCustomer>()
                    .eq(BrJourneyStageCustomer::getJourneyId, brJourneyStage.getJourneyId())
                    .eq(BrJourneyStageCustomer::getCustomerExtId, customer.getExtId()));
            if (old == null) {
                throw new BaseException("操作非法");
            }
        }


        //封装数据
        BrJourneyStageCustomer brJourneyStageCustomer = new BrJourneyStageCustomer();
        BeanUtils.copyProperties(dto, brJourneyStageCustomer);
        brJourneyStageCustomer
                .setId(old.getId())
                .setCreatedAt(old.getCreatedAt())
                .setCustomerExtId(customer.getExtId())
                .setJourneyId(brJourneyStage.getJourneyId())
                .setCreator(old.getCreator());


        //校重
        checkRepeat(brJourneyStageCustomer);

        //入库
        updateById(brJourneyStageCustomer);

        //客户动态
        CustomerDynamicInfoDTO customerDynamicInfoDTO = new CustomerDynamicInfoDTO()
                .setJourneyId(brJourneyStage.getJourneyId())
                .setJourneyName(journeyService.checkExists(brJourneyStage.getJourneyId()).getName())
                .setOldStageId(old.getJourneyStageId())
                .setOldStageName(journeyStageService.checkExists(old.getJourneyStageId()).getName())
                .setNewStageId(brJourneyStage.getId())
                .setNewStageName(brJourneyStage.getName());
        customerDynamicService.save(BrCustomerDynamicModelEnum.CUSTOMER_STAGE.getCode(),
                BrCustomerDynamicTypeEnum.STAGE_UPDATE.getCode(),
                dto.getExtCorpId(),
                JwtUtil.getExtUserId(),
                customer.getExtId(),
                customerDynamicInfoDTO);
        return brJourneyStageCustomer;
    }


    @Override
    public void delete(String id) {

        BrJourneyStageCustomer brJourneyStage = checkExists(id);

        if (Optional.ofNullable(baseMapper.queryList(new BrJourneyStageCustomerQueryDTO().setJourneyStageId(id))).orElse(new ArrayList<>()).size() > 0) {
            throw new BaseException("旅程阶段还存在客户,请先移除该旅程阶段的客户");
        }

        //删除
        removeById(id);

        //客户动态
        CustomerDynamicInfoDTO customerDynamicInfoDTO = new CustomerDynamicInfoDTO()
                .setJourneyId(brJourneyStage.getJourneyId())
                .setJourneyName(journeyService.checkExists(brJourneyStage.getJourneyId()).getName())
                .setOldStageId(brJourneyStage.getJourneyStageId())
                .setOldStageName(journeyStageService.checkExists(brJourneyStage.getJourneyStageId()).getName());
        customerDynamicService.save(BrCustomerDynamicModelEnum.CUSTOMER_STAGE.getCode(),
                BrCustomerDynamicTypeEnum.STAGE_DELETE.getCode(),
                brJourneyStage.getExtCorpId(),
                staffService.find(brJourneyStage.getCreator()).getExtId(),
                brJourneyStage.getCustomerExtId(),
                customerDynamicInfoDTO);
    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //删除
        dto.getIds().forEach(this::delete);
    }


    /**
     * 翻译
     *
     * @param brJourneyStageCustomer 实体
     * @return BrJourneyStageCustomerVO 结果集
     * @author xxh
     * @date 2022-04-06
     */
    private BrJourneyStageCustomerVO translation(BrJourneyStageCustomer brJourneyStageCustomer) {
        BrJourneyStageCustomerVO vo = new BrJourneyStageCustomerVO();
        BeanUtils.copyProperties(brJourneyStageCustomer, vo);
        vo.setCustomer(customerService.find(brJourneyStageCustomer.getExtCorpId(), brJourneyStageCustomer.getCustomerExtId()));
        vo.setCreatorStaff(staffService.find(brJourneyStageCustomer.getCreator()));
        return vo;
    }


    @Override
    public BrJourneyStageCustomer checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrJourneyStageCustomer byId = getById(id);
        if (byId == null) {
            throw new BaseException("旅程阶段-客户关联不存在");
        }
        return byId;
    }

    @Override
    public IPage<WxCustomerVO> pageCustomerList(BrJourneyCustomerPageDTO dto) {

        return customerService.pageCustomerList(dto);
    }

    @Override
    public List<BrJourneyStageCustomer> batchSave(BrJourneyStageCustomerBatchSaveDTO dto) {
        List<BrJourneyStageCustomer> result = new ArrayList<>();
        List<BrJourneyStageCustomerSaveDTO> saveDTOS = dto.getCustomerIds().stream().map(customerId -> new BrJourneyStageCustomerSaveDTO().setExtCorpId(dto.getExtCorpId()).setCustomerId(customerId).setJourneyStageId(dto.getJourneyStageId())).collect(Collectors.toList());
        saveDTOS.forEach(saveDTO -> result.add(save(saveDTO)));
        return result;
    }

    @Override
    public void deleteByCustomerExtIdAndStageId(String customerExtId, String stageId) {
        WxCustomer wxCustomer = customerService.checkExists(JwtUtil.getExtCorpId(), customerExtId);
       journeyStageService.checkExists(stageId);
        if (wxCustomer != null) {
            remove(new LambdaQueryWrapper<BrJourneyStageCustomer>()
                    .eq(BrJourneyStageCustomer::getExtCorpId,JwtUtil.getExtCorpId())
                    .eq(BrJourneyStageCustomer::getCustomerExtId,customerExtId)
                    .eq(BrJourneyStageCustomer::getJourneyStageId,stageId));
        }

    }

}
