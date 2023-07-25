package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.WxMsgAttachmentDTO;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.*;
import com.scrm.server.wx.cp.mapper.BrOpportunityMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.ReportUtil;
import com.scrm.server.wx.cp.vo.BrCustomerFollowVO;
import com.scrm.server.wx.cp.vo.BrFollowTaskVO;
import com.scrm.server.wx.cp.vo.BrOpportunityVO;
import com.scrm.server.wx.cp.vo.DailyTotalVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 商机 服务实现类
 *
 * @author ouyang
 * @since 2022-06-07
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrOpportunityServiceImpl extends ServiceImpl<BrOpportunityMapper, BrOpportunity> implements IBrOpportunityService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrOpportunityCooperatorService cooperatorService;

    @Autowired
    private IBrCommonConfService confService;

    @Autowired
    private IBrCustomerFollowService followService;

    @Autowired
    private IBrFollowTaskService followTaskService;

    @Autowired
    private IBrFieldLogService fieldLogService;

    @Autowired
    private IBrOpportunityGroupService opportunityGroupService;

    @Autowired
    private IWxCustomerService customerService;

    @Override
    public IPage<BrOpportunityVO> pageList(BrOpportunityPageDTO dto) {
        if (!staffService.isAdmin()) {
            dto.setCurrentUserId(JwtUtil.getUserId());
            dto.setCurrentExtUserId(JwtUtil.getExtUserId());
        }
        //处理阶段
        if (StringUtils.isBlank(dto.getStageId())) {
            //查询赢单和输单的阶段id
            BrCommonConfQueryDTO brCommonConfQueryDTO = new BrCommonConfQueryDTO().setExtCorpId(dto.getExtCorpId())
                    .setTypeCode(BrCommonConf.OPPORTUNITY_STAGE).setIsSystem(true);
            if (StringUtils.isNotBlank(dto.getGroupId())) {
                brCommonConfQueryDTO.setGroupId(dto.getGroupId());
            }
            List<String> sysStageIds = confService.queryList(brCommonConfQueryDTO).stream().map(e -> e.getId()).collect(Collectors.toList());
            if (BrOpportunityPageDTO.CLOSE_STATUS.equals(dto.getStatus())) {
                dto.setStageIdList(sysStageIds);
            } else if (BrOpportunityPageDTO.DOING_STATUS.equals(dto.getStatus())) {
                dto.setNotStageIdList(sysStageIds);
            }
        }

        return baseMapper.pageList(new Page<>(dto.getPageNum(), dto.getPageSize()), dto).convert(this::translation);
    }


    @Override
    public List<BrOpportunityVO> queryList(BrOpportunityQueryDTO dto) {
        if (!staffService.isAdmin()) {
            dto.setCurrentUserId(JwtUtil.getUserId());
            dto.setCurrentExtUserId(JwtUtil.getExtUserId());
        }
        return Optional.ofNullable(baseMapper.queryList(dto)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }

    @Override
    public BrOpportunityVO findById(String id) {
        return detailTranslation(checkExists(id));
    }


    @Override
    public BrOpportunity save(BrOpportunitySaveDTO dto) {

        //校验参数
        checkRepeat(null, dto.getExtCorpId(), dto.getName(), dto.getGroupId());

        //封装数据
        BrOpportunity brOpportunity = new BrOpportunity();
        BeanUtils.copyProperties(dto, brOpportunity);
        brOpportunity.setId(UUID.get32UUID())
                .setCreatedAt(new Date())
                .setCreator(JwtUtil.getUserId());

        //入库
        save(brOpportunity);

        //处理协作人数据
        handlerCooperatorList(brOpportunity, dto.getOpportunityCooperatorList());

        return brOpportunity;
    }


    @Override
    public BrOpportunity update(BrOpportunityUpdateDTO dto) {

        //校验参数
        BrOpportunity old = checkExists(dto.getId());
        checkRepeat(dto.getId(), dto.getExtCorpId(), dto.getName(), dto.getGroupId());

        //封装数据
        BrOpportunity brOpportunity = new BrOpportunity();
        BeanUtils.copyProperties(dto, brOpportunity);
        brOpportunity.setCreatedAt(old.getCreatedAt())
                .setCreator(old.getCreator())
                .setUpdatedAt(new Date())
                .setEditor(JwtUtil.getUserId());

        //入库
        updateById(brOpportunity);

        //记录字段更新日志
        fieldLogService.save(old, brOpportunity, BrFieldLog.OPPORTUNITY_TABLE_NAME, brOpportunity.getId(), brOpportunity.getExtCorpId());

        //处理协作人数据
        handlerCooperatorList(brOpportunity, dto.getOpportunityCooperatorList());

        return brOpportunity;
    }

    /**
     * 新增/修改协作人
     *
     * @param brOpportunity             商机
     * @param opportunityCooperatorList 商机协作人列表
     * @author ouyang
     */
    private void handlerCooperatorList(BrOpportunity brOpportunity, List<BrOpportunityCooperatorSaveOrUpdateDTO> opportunityCooperatorList) {

        if (ListUtils.isEmpty(opportunityCooperatorList)) {
            return;
        }

        //1、从数据库移除已被删除的数据
        String id = brOpportunity.getId();
        List<String> cooperatorIds = opportunityCooperatorList.stream().map(BrOpportunityCooperatorSaveOrUpdateDTO::getId).collect(Collectors.toList());
        List<String> needDeleteCooperatorIds = Optional.ofNullable(cooperatorService.list(new LambdaQueryWrapper<BrOpportunityCooperator>()
                .select(BrOpportunityCooperator::getId)
                .eq(BrOpportunityCooperator::getOpportunityId, id)
                .notIn(ListUtils.isNotEmpty(cooperatorIds), BrOpportunityCooperator::getId, cooperatorIds)
        )).orElse(new ArrayList<>()).stream().map(BrOpportunityCooperator::getId).collect(Collectors.toList());
        cooperatorService.batchDelete(new BatchDTO<String>().setIds(needDeleteCooperatorIds));

        //2、遍历新增/修改协作人数据
        opportunityCooperatorList.forEach(cooperator -> {
            if (StringUtils.isNotBlank(cooperator.getId())) {
                BrOpportunityCooperatorUpdateDTO cooperatorUpdateDTO = new BrOpportunityCooperatorUpdateDTO();
                BeanUtils.copyProperties(cooperator, cooperatorUpdateDTO);
                cooperatorUpdateDTO.setExtCorpId(brOpportunity.getExtCorpId()).setOpportunityId(brOpportunity.getId());
                cooperatorService.update(cooperatorUpdateDTO);
            } else {
                BrOpportunityCooperatorSaveDTO cooperatorSaveDTO = new BrOpportunityCooperatorSaveDTO();
                BeanUtils.copyProperties(cooperator, cooperatorSaveDTO);
                cooperatorSaveDTO.setExtCorpId(brOpportunity.getExtCorpId()).setOpportunityId(brOpportunity.getId());
                cooperatorService.save(cooperatorSaveDTO);
            }
        });

    }

    /**
     * 校验重复
     *
     * @param id        id
     * @param extCorpId 企业id
     * @param name      名称
     * @author ouyang
     */
    private void checkRepeat(String id, String extCorpId, String name, String groupId) {
        if (OptionalLong.of(count(new LambdaQueryWrapper<BrOpportunity>()
                .ne(id != null, BrOpportunity::getId, id)
                .eq(BrOpportunity::getGroupId, groupId)
                .eq(BrOpportunity::getName, name)
                .eq(BrOpportunity::getExtCorpId, extCorpId))).orElse(0) > 0) {
            throw new BaseException(String.format("商机：【%s】已存在,请重命名", name));
        }
    }


    @Override
    public void delete(String id) {

        //校验参数
        BrOpportunity brOpportunity = checkExists(id);

        //删除
        removeById(id);

        //删除商机-协作人关联
        cooperatorService.remove(new LambdaQueryWrapper<BrOpportunityCooperator>().eq(BrOpportunityCooperator::getOpportunityId, id));

        //删除动态
        fieldLogService.deleteByDataIds(BrFieldLog.OPPORTUNITY_TABLE_NAME, Arrays.asList(id));
    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        List<BrOpportunity> brOpportunityList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> brOpportunityList.add(checkExists(id)));

        //删除
        removeByIds(dto.getIds());

        //批量删除商机-协作人关联
        ListUtils.execute(opportunityIds -> cooperatorService.remove(new LambdaQueryWrapper<BrOpportunityCooperator>().in(BrOpportunityCooperator::getOpportunityId, opportunityIds)), dto.getIds(), 999);
        //删除动态
        fieldLogService.deleteByDataIds(BrFieldLog.OPPORTUNITY_TABLE_NAME, dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brOpportunity 实体
     * @return BrOpportunityVO 结果集
     * @author ouyang
     * @date 2022-06-07
     */
    private BrOpportunityVO translation(BrOpportunity brOpportunity) {
        BrOpportunityVO vo = new BrOpportunityVO();
        BeanUtils.copyProperties(brOpportunity, vo);

        //翻译创建者
        Staff staff = staffService.find(brOpportunity.getCreator());
        vo.setCreatorCN(staff != null ? staff.getName() : brOpportunity.getCreator());

        //翻译更新人
        vo.setEditorStaff(staffService.find(brOpportunity.getCreator()));

        //翻译阶段
        vo.setStage(confService.getOne(new LambdaQueryWrapper<BrCommonConf>()
                .eq(BrCommonConf::getExtCorpId, brOpportunity.getExtCorpId())
                .eq(BrCommonConf::getId, brOpportunity.getStageId())
                .eq(BrCommonConf::getGroupId, brOpportunity.getGroupId())
                .eq(BrCommonConf::getTypeCode, BrCommonConf.OPPORTUNITY_STAGE)));

        //翻译负责人
        vo.setOwnerStaff(staffService.find(brOpportunity.getExtCorpId(), brOpportunity.getOwner()));

        //翻译跟进人
        vo.setCooperatorList(cooperatorService.findByOpportunityId(brOpportunity.getId()));

        //翻译客户
        vo.setCustomer(customerService.find(brOpportunity.getExtCorpId(), brOpportunity.getCustomerExtId()));

        //商机跟进
        BrCustomerFollowQueryDTO dto = new BrCustomerFollowQueryDTO();
        dto.setExtCorpId(brOpportunity.getExtCorpId()).setType(BrCustomerFollow.OPPORTUNITY_TYPE)
                .setExtCustomerId(brOpportunity.getId());
        List<BrCustomerFollowVO> followVOS = followService.list(dto);
        vo.setFollowList(followVOS);
        if (ListUtils.isNotEmpty(followVOS)) {
            vo.setLastFollowAt(followVOS.get(0).getCreatedAt());
        }

        return vo;
    }

    /**
     * 翻译详细信息
     *
     * @param brOpportunity 实体
     * @return BrOpportunityVO 结果集
     * @author ouyang
     * @date 2022-06-07
     */
    private BrOpportunityVO detailTranslation(BrOpportunity brOpportunity) {
        BrOpportunityVO vo = translation(brOpportunity);

        vo.setGroupName(opportunityGroupService.getById(brOpportunity.getGroupId()).getName());
        //商机失败原因
        if (StringUtils.isNotBlank(brOpportunity.getFailReasonId())) {
            vo.setFailReasonCN(confService.findById(brOpportunity.getFailReasonId()).getName());
        }

        List<BrCustomerFollowVO> followVOS = vo.getFollowList();
        if (ListUtils.isEmpty(followVOS)) {
            vo.setMediaList(new ArrayList<>());
            vo.setTaskList(new ArrayList<>());

            return vo;
        }


        //关联任务
        List<String> followIds = followVOS.stream().map(e -> e.getId()).collect(Collectors.toList());
        List<BrFollowTaskVO> brFollowTaskVOS = followTaskService.queryList(new BrFollowTaskQueryDTO()
                .setExtCorpId(brOpportunity.getExtCorpId()).setFollowIds(followIds));
        if (ListUtils.isNotEmpty(brFollowTaskVOS)) {
            brFollowTaskVOS.forEach(e -> e.setCreatorCN(vo.getCreatorCN()));
            vo.setTaskList(brFollowTaskVOS);
        } else {
            vo.setTaskList(new ArrayList<>());
        }

        //关联附件
        List<WxMsgAttachmentDTO> dtos = new ArrayList<>();
        followVOS.stream().forEach(
                e -> {
                    List<WxMsgAttachmentDTO> media = e.getContent().getMedia();
                    if (ListUtils.isNotEmpty(media)) {
                        dtos.addAll(media);
                    }
                }
        );
        vo.setMediaList(dtos);

        return vo;
    }


    @Override
    public BrOpportunity checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrOpportunity byId = getById(id);
        if (byId == null) {
            throw new BaseException("商机不存在" );
        }
        return byId;
    }

    @Override
    public void updateStage(BrOpportunityUpdateStageDTO dto) {
        BrOpportunity opportunity = checkExists(dto.getId());
        if (!dto.getStageId().equals(opportunity.getStageId())) {
            BrFieldLog brFieldLog = new BrFieldLog();
            brFieldLog.setId(UUID.get32UUID()).setMethod(BrFieldLog.FIELD_UPDATE)
                    .setTableName(BrFieldLog.OPPORTUNITY_TABLE_NAME)
                    .setOldValue(confService.findById(opportunity.getStageId()).getName())
                    .setNewValue(confService.findById(dto.getStageId()).getName())
                    .setOperId(JwtUtil.getExtUserId()).setExtCorpId(JwtUtil.getExtCorpId())
                    .setOperTime(opportunity.getUpdatedAt()).setFieldName("阶段" ).setDataId(opportunity.getId());
            fieldLogService.save(brFieldLog);
        }

        opportunity.setStageId(dto.getStageId()).setUpdatedAt(new Date())
                .setEditor(JwtUtil.getUserId()).setFailReason(dto.getFailReason())
                .setFailReasonId(dto.getFailReasonId());
        updateById(opportunity);
    }

    @Override
    public Long getAddedCountByDate(Date date, String extCorpId) {
        return baseMapper.addedByDate(date, extCorpId);
    }

    @Override
    public List<Map<String, Object>> countByDateAndCorp(Date date) {
        return this.baseMapper.countByDateAndCorp(date);
    }


    @Override
    public Long countByDateAndStaff() {
        String extStaffId = JwtUtil.getExtUserId();
        String extCorpId = JwtUtil.getExtCorpId();
        Date startTime = DateUtils.getYesterdayTime(true);
        Date endTime = DateUtils.getYesterdayTime(false);
        return count(new QueryWrapper<BrOpportunity>().lambda()
                .eq(BrOpportunity::getExtCorpId, extCorpId)
                .eq(BrOpportunity::getOwner, extStaffId)
                .ge(BrOpportunity::getCreatedAt, startTime).le(BrOpportunity::getCreatedAt, endTime));
    }


    @Override
    public Long countByToday() {
        Date startTime = DateUtils.getTodayStartTime();
        Date endTime = new Date();
        return count(new QueryWrapper<BrOpportunity>().lambda()
                .eq(BrOpportunity::getExtCorpId, JwtUtil.getExtCorpId())
                .ge(BrOpportunity::getCreatedAt, startTime).le(BrOpportunity::getCreatedAt, endTime)
                .eq(!staffService.isAdmin(), BrOpportunity::getCreator, JwtUtil.getUserId())
                .or(w -> {
                    w.eq(BrOpportunity::getOwner, JwtUtil.getExtUserId());
                }));
    }


    @Override
    public List<DailyTotalVO> getLastNDaysCountDaily(Integer days) {
        Date startTime = DateUtils.getDate(new Date(), -days + 1, "00:00" );
        Date endTime = new Date();
        List<DailyTotalVO> list = this.baseMapper.getLastNDaysCountDaily(startTime, endTime,JwtUtil.getExtCorpId());
        return ReportUtil.composeResultToEchart(days,list);
    }

}
