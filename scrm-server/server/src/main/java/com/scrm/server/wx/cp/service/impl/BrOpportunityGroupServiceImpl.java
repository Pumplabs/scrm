package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrCommonConf;
import com.scrm.server.wx.cp.entity.BrOpportunity;
import com.scrm.server.wx.cp.entity.BrOpportunityGroup;
import com.scrm.server.wx.cp.mapper.BrOpportunityGroupMapper;
import com.scrm.server.wx.cp.service.IBrCommonConfService;
import com.scrm.server.wx.cp.service.IBrOpportunityGroupService;
import com.scrm.server.wx.cp.service.IBrOpportunityService;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.vo.BrOpportunityGroupVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 商机分组 服务实现类
 *
 * @author ouyang
 * @since 2022-06-07
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrOpportunityGroupServiceImpl extends ServiceImpl<BrOpportunityGroupMapper, BrOpportunityGroup> implements IBrOpportunityGroupService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrCommonConfService confService;

    @Autowired
    private IBrOpportunityService opportunityService;

    @Override
    public IPage<BrOpportunityGroupVO> pageList(BrOpportunityGroupPageDTO dto) {
        checkDefault(dto.getExtCorpId());

        LambdaQueryWrapper<BrOpportunityGroup> wrapper = new QueryWrapper<BrOpportunityGroup>()
                .lambda().eq(BrOpportunityGroup::getExtCorpId, dto.getExtCorpId())
                .like(StringUtils.isNotBlank(dto.getName()), BrOpportunityGroup::getName, dto.getName())
                .orderByDesc(BrOpportunityGroup::getCreatedAt);
        IPage<BrOpportunityGroup> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrOpportunityGroupVO> queryList(BrOpportunityGroupQueryDTO dto) {
        checkDefault(dto.getExtCorpId());

        LambdaQueryWrapper<BrOpportunityGroup> wrapper = new QueryWrapper<BrOpportunityGroup>()
                .lambda().eq(BrOpportunityGroup::getExtCorpId, dto.getExtCorpId())
                .like(StringUtils.isNotBlank(dto.getName()), BrOpportunityGroup::getName, dto.getName())
                .orderByDesc(BrOpportunityGroup::getCreatedAt);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }

    /**
     * 检查是否有默认分组
     */
    private void checkDefault(String extCorpId) {
        if (count(new LambdaQueryWrapper<BrOpportunityGroup>()
                .eq(BrOpportunityGroup::getExtCorpId, extCorpId)
                .eq(BrOpportunityGroup::getIsSystem, true)) == 0) {

            BrOpportunityGroupSaveDTO opportunityGroupSaveDTO = new BrOpportunityGroupSaveDTO();
            opportunityGroupSaveDTO.setExtCorpId(extCorpId)
                    .setIsSystem(true)
                    .setName("默认分组")
                    .setCreator("--");
            save(opportunityGroupSaveDTO);
        }

    }

    @Override
    public BrOpportunityGroupVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrOpportunityGroup save(BrOpportunityGroupSaveDTO dto) {
        //校验数据
        checkRepeat(null, dto.getExtCorpId(), dto.getName());

        //封装数据
        BrOpportunityGroup brOpportunityGroup = new BrOpportunityGroup();
        BeanUtils.copyProperties(dto, brOpportunityGroup);
        brOpportunityGroup.setId(UUID.get32UUID())
                .setUpdatedAt(new Date())
                .setCreatedAt(new Date());
        if (dto.getIsSystem() == null) {
            brOpportunityGroup.setIsSystem(false);
        }

        if (StringUtils.isBlank(dto.getCreator())) {
            brOpportunityGroup.setCreator(JwtUtil.getUserId());
        }

        //入库
        save(brOpportunityGroup);

        BrCommonConfSaveDTO brCommonConfSaveDTO1 = new BrCommonConfSaveDTO();
        brCommonConfSaveDTO1.setTypeCode(BrCommonConf.OPPORTUNITY_STAGE).setName("初步接洽").setGroupId(brOpportunityGroup.getId())
                .setColor("#5483ED").setIsSystem(false).setExtCorpId(dto.getExtCorpId()).setCode(2).setSort(1);
        confService.save(brCommonConfSaveDTO1);

        BrCommonConfSaveDTO brCommonConfSaveDTO2 = new BrCommonConfSaveDTO();
        brCommonConfSaveDTO2.setTypeCode(BrCommonConf.OPPORTUNITY_STAGE).setName("需求调研").setGroupId(brOpportunityGroup.getId())
                .setColor("#7132F8").setIsSystem(false).setExtCorpId(dto.getExtCorpId()).setCode(3).setSort(2);
        confService.save(brCommonConfSaveDTO2);


        BrCommonConfSaveDTO brCommonConfSaveDTO3 = new BrCommonConfSaveDTO();
        brCommonConfSaveDTO3.setTypeCode(BrCommonConf.OPPORTUNITY_STAGE).setName("方案确认").setGroupId(brOpportunityGroup.getId())
                .setColor("#3A75C5").setIsSystem(false).setExtCorpId(dto.getExtCorpId()).setCode(4).setSort(3);
        confService.save(brCommonConfSaveDTO3);

        BrCommonConfSaveDTO brCommonConfSaveDTO4 = new BrCommonConfSaveDTO();
        brCommonConfSaveDTO4.setTypeCode(BrCommonConf.OPPORTUNITY_STAGE).setName("报价").setGroupId(brOpportunityGroup.getId())
                .setColor("#3A75C5").setIsSystem(false).setExtCorpId(dto.getExtCorpId()).setCode(5).setSort(4);
        confService.save(brCommonConfSaveDTO4);

        BrCommonConfSaveDTO brCommonConfSaveDTO5 = new BrCommonConfSaveDTO();
        brCommonConfSaveDTO5.setTypeCode(BrCommonConf.OPPORTUNITY_STAGE).setName("合同谈判").setGroupId(brOpportunityGroup.getId())
                .setColor("#3A75C5").setIsSystem(false).setExtCorpId(dto.getExtCorpId()).setCode(6).setSort(5);
        confService.save(brCommonConfSaveDTO5);

        //默认同时添加输单，赢单阶段
        BrCommonConfSaveDTO winDto = new BrCommonConfSaveDTO();
        winDto.setTypeCode(BrCommonConf.OPPORTUNITY_STAGE).setName("赢单").setGroupId(brOpportunityGroup.getId())
                .setColor("#57A65B").setIsSystem(true).setExtCorpId(dto.getExtCorpId()).setCode(0).setSort(6);
        confService.save(winDto);

        BrCommonConfSaveDTO loseDto = new BrCommonConfSaveDTO();
        loseDto.setTypeCode(BrCommonConf.OPPORTUNITY_STAGE).setName("输单").setGroupId(brOpportunityGroup.getId())
                .setColor("#DD4377").setIsSystem(true).setExtCorpId(dto.getExtCorpId()).setCode(1).setSort(7);
        confService.save(loseDto);

        return brOpportunityGroup;
    }


    @Override
    public BrOpportunityGroup update(BrOpportunityGroupUpdateDTO dto) {

        //校验参数
        BrOpportunityGroup old = checkExists(dto.getId());
        checkRepeat(dto.getId(), dto.getExtCorpId(), dto.getName());

        //封装数据
        BrOpportunityGroup brOpportunityGroup = new BrOpportunityGroup();
        BeanUtils.copyProperties(dto, brOpportunityGroup);
        brOpportunityGroup.setCreatedAt(old.getCreatedAt())
                .setCreator(old.getCreator())
                .setUpdatedAt(new Date())
                .setEditor(JwtUtil.getUserId());

        //入库
        updateById(brOpportunityGroup);

        return brOpportunityGroup;
    }

    /**
     * 校验重复
     *
     * @param id        id
     * @param extCorpId 企业id
     * @param name      名称
     * @author ouyang
     */
    private void checkRepeat(String id, String extCorpId, String name) {
        if (OptionalLong.of(count(new LambdaQueryWrapper<BrOpportunityGroup>()
                .ne(id != null, BrOpportunityGroup::getId, id)
                .eq(BrOpportunityGroup::getName, name)
                .eq(BrOpportunityGroup::getExtCorpId, extCorpId))).orElse(0) > 0) {
            throw new BaseException(String.format("分组：【%s】已存在,请重命名", name));
        }
    }


    @Override
    public void delete(String id) {

        //校验参数
        BrOpportunityGroup brOpportunityGroup = checkExists(id);
        if (brOpportunityGroup.getIsSystem()) {
            throw new BaseException("该商机分组为默认分组，不能删除");
        }

        //删除
        removeById(id);

        //删除阶段
        List<BrCommonConf> commonConfList = confService.list(new LambdaQueryWrapper<BrCommonConf>().eq(BrCommonConf::getGroupId, id));
        if (ListUtils.isNotEmpty(commonConfList)) {
            confService.batchDelete(new BatchDTO<String>().setIds(commonConfList.stream().map(e -> e.getId()).collect(Collectors.toList())));
        }

        //删除商机
        List<BrOpportunity> opportunityList = opportunityService.list(new LambdaQueryWrapper<BrOpportunity>().eq(BrOpportunity::getGroupId, id));
        if (ListUtils.isNotEmpty(opportunityList)) {
            opportunityService.batchDelete(new BatchDTO<String>().setIds(opportunityList.stream().map(e -> e.getId()).collect(Collectors.toList())));
        }

    }


    /**
     * 翻译
     *
     * @param brOpportunityGroup 实体
     * @return BrOpportunityGroupVO 结果集
     * @author ouyang
     * @date 2022-06-07
     */
    private BrOpportunityGroupVO translation(BrOpportunityGroup brOpportunityGroup) {
        BrOpportunityGroupVO vo = new BrOpportunityGroupVO();
        BeanUtils.copyProperties(brOpportunityGroup, vo);

        //翻译创建者
        Staff staff = staffService.find(brOpportunityGroup.getCreator());
        vo.setCreatorCN(staff!=null?staff.getName():brOpportunityGroup.getCreator());
        return vo;
    }


    @Override
    public BrOpportunityGroup checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrOpportunityGroup byId = getById(id);
        if (byId == null) {
            throw new BaseException("商机分组不存在");
        }
        return byId;
    }
}
