package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrCommonConfPageDTO;
import com.scrm.server.wx.cp.dto.BrCommonConfQueryDTO;
import com.scrm.server.wx.cp.dto.BrCommonConfSaveDTO;
import com.scrm.server.wx.cp.dto.BrCommonConfUpdateDTO;
import com.scrm.server.wx.cp.entity.BrCommonConf;
import com.scrm.server.wx.cp.entity.BrOpportunity;
import com.scrm.server.wx.cp.mapper.BrCommonConfMapper;
import com.scrm.server.wx.cp.service.IBrCommonConfService;
import com.scrm.server.wx.cp.service.IBrOpportunityService;
import com.scrm.server.wx.cp.vo.BrCommonConfVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 通用配置 服务实现类
 *
 * @author ouyang
 * @since 2022-06-07
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrCommonConfServiceImpl extends ServiceImpl<BrCommonConfMapper, BrCommonConf> implements IBrCommonConfService {

    @Autowired
    private IBrOpportunityService opportunityService;

    @Override
    public IPage<BrCommonConfVO> pageList(BrCommonConfPageDTO dto) {
        LambdaQueryWrapper<BrCommonConf> wrapper = new QueryWrapper<BrCommonConf>()
                .lambda().eq(BrCommonConf::getExtCorpId, dto.getExtCorpId())
                .eq(BrCommonConf::getTypeCode, dto.getTypeCode())
                .eq(StringUtils.isNotBlank(dto.getGroupId()), BrCommonConf::getGroupId, dto.getGroupId())
                .orderByAsc(BrCommonConf::getSort);

        IPage<BrCommonConf> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrCommonConfVO> queryList(BrCommonConfQueryDTO dto) {
        LambdaQueryWrapper<BrCommonConf> wrapper = new QueryWrapper<BrCommonConf>()
                .lambda().eq(BrCommonConf::getExtCorpId, dto.getExtCorpId())
                .eq(BrCommonConf::getTypeCode, dto.getTypeCode())
                .eq(StringUtils.isNotBlank(dto.getGroupId()), BrCommonConf::getGroupId, dto.getGroupId())
                .eq(dto.getIsSystem() != null, BrCommonConf::getIsSystem, dto.getIsSystem())
                .orderByAsc(BrCommonConf::getSort);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrCommonConfVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrCommonConf save(BrCommonConfSaveDTO dto) {

        //校验数据
        checkRepeat(null, dto.getExtCorpId(), dto.getName(), dto.getGroupId(), dto.getTypeCode());

        //封装数据
        BrCommonConf brCommonConf = new BrCommonConf();
        BeanUtils.copyProperties(dto, brCommonConf);
        brCommonConf.setId(UUID.get32UUID())
                .setUpdatedAt(new Date())
                .setCreatedAt(new Date())
                .setCreator(JwtUtil.getUserId());

        if (dto.getIsSystem() == null) {
            brCommonConf.setIsSystem(false);
        }

        //入库
        save(brCommonConf);

        return brCommonConf;
    }


    @Override
    public BrCommonConf update(BrCommonConfUpdateDTO dto) {

        //校验参数
        BrCommonConf old = checkExists(dto.getId());
        checkRepeat(dto.getId(), dto.getExtCorpId(), dto.getName(), dto.getGroupId(), dto.getTypeCode());

        //封装数据
        BrCommonConf brCommonConf = new BrCommonConf();
        BeanUtils.copyProperties(dto, brCommonConf);
        brCommonConf.setCreatedAt(old.getCreatedAt())
                .setCreator(old.getCreator())
                .setUpdatedAt(new Date())
                .setEditor(JwtUtil.getUserId());

        //入库
        updateById(brCommonConf);

        return brCommonConf;
    }

    /**
     * 校验重复
     *
     * @param id        id
     * @param extCorpId 企业id
     * @param name      名称
     * @param groupId   分组id
     * @param typeCode  类型编码
     * @author ouyang
     */
    private void checkRepeat(String id, String extCorpId, String name, String groupId, String typeCode) {
        if (OptionalLong.of(count(new LambdaQueryWrapper<BrCommonConf>()
                .ne(id != null, BrCommonConf::getId, id)
                .eq(StringUtils.isNotBlank(groupId), BrCommonConf::getGroupId, groupId)
                .eq(BrCommonConf::getTypeCode, typeCode)
                .eq(BrCommonConf::getName, name)
                .eq(BrCommonConf::getExtCorpId, extCorpId))).orElse(0) > 0) {
            throw new BaseException(String.format("配置：【%s】已存在,请重命名", name));
        }
    }


    @Override
    public void delete(String id) {

        //校验参数
        BrCommonConf brCommonConf = checkExists(id);
        checkRelateExists(brCommonConf);

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        List<BrCommonConf> brCommonConfList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> brCommonConfList.add(checkExists(id)));

        Optional.ofNullable(brCommonConfList).orElse(new ArrayList<>()).forEach(commonConf -> checkRelateExists(commonConf));

        //删除
        removeByIds(dto.getIds());
    }

    /**
     * 判断是否有关联数据
     */
    public void checkRelateExists(BrCommonConf brCommonConf) {
        if (BrCommonConf.OPPORTUNITY_STAGE.equals(brCommonConf.getTypeCode())) {
            int count = (int) opportunityService.count(new LambdaQueryWrapper<BrOpportunity>()
                    .eq(BrOpportunity::getExtCorpId, brCommonConf.getExtCorpId())
                    .eq(BrOpportunity::getStageId, brCommonConf.getId()));
            if (count > 0) {
                throw new BaseException("配置存在关联商机数据，无法删除！");
            }
        }
    }

    /**
     * 翻译
     *
     * @param brCommonConf 实体
     * @return BrCommonConfVO 结果集
     * @author ouyang
     * @date 2022-06-07
     */
    private BrCommonConfVO translation(BrCommonConf brCommonConf) {
        BrCommonConfVO vo = new BrCommonConfVO();
        BeanUtils.copyProperties(brCommonConf, vo);

        if (BrCommonConf.OPPORTUNITY_STAGE.equals(brCommonConf.getTypeCode())) {
            vo.setRelateCount((int) opportunityService.count(new LambdaQueryWrapper<BrOpportunity>()
                    .eq(BrOpportunity::getExtCorpId, brCommonConf.getExtCorpId())
                    .eq(BrOpportunity::getStageId, brCommonConf.getId())));
        }

        return vo;
    }


    @Override
    public BrCommonConf checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrCommonConf byId = getById(id);
        if (byId == null) {
            throw new BaseException("配置不存在");
        }
        return byId;
    }
}
