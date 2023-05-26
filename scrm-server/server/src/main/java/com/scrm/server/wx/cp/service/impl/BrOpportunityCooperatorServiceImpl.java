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
import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorPageDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorQueryDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorSaveDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorUpdateDTO;
import com.scrm.server.wx.cp.entity.BrOpportunityCooperator;
import com.scrm.server.wx.cp.mapper.BrOpportunityCooperatorMapper;
import com.scrm.server.wx.cp.service.IBrOpportunityCooperatorService;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.vo.BrOpportunityCooperatorVO;
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
 * 商机-协作人关联 服务实现类
 *
 * @author ouyang
 * @since 2022-06-07
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrOpportunityCooperatorServiceImpl extends ServiceImpl<BrOpportunityCooperatorMapper, BrOpportunityCooperator> implements IBrOpportunityCooperatorService {

    @Autowired
    private IStaffService staffService;

    @Override
    public IPage<BrOpportunityCooperatorVO> pageList(BrOpportunityCooperatorPageDTO dto) {
        LambdaQueryWrapper<BrOpportunityCooperator> wrapper = new QueryWrapper<BrOpportunityCooperator>()
                .lambda().eq(BrOpportunityCooperator::getExtCorpId, dto.getExtCorpId());
        IPage<BrOpportunityCooperator> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrOpportunityCooperatorVO> queryList(BrOpportunityCooperatorQueryDTO dto) {
        LambdaQueryWrapper<BrOpportunityCooperator> wrapper = new QueryWrapper<BrOpportunityCooperator>()
                .lambda().eq(BrOpportunityCooperator::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrOpportunityCooperatorVO findById(String id) {
        return translation(checkExists(id));
    }

    @Override
    public List<BrOpportunityCooperatorVO> findByOpportunityId(String opportunityId) {
        LambdaQueryWrapper<BrOpportunityCooperator> wrapper = new QueryWrapper<BrOpportunityCooperator>()
                .lambda().eq(BrOpportunityCooperator::getOpportunityId,opportunityId);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrOpportunityCooperator save(BrOpportunityCooperatorSaveDTO dto) {
        //封装数据
        BrOpportunityCooperator brOpportunityCooperator = new BrOpportunityCooperator();
        BeanUtils.copyProperties(dto, brOpportunityCooperator);
        brOpportunityCooperator.setId(UUID.get32UUID())
                .setCreatedAt(new Date())
                .setCreator(JwtUtil.getUserId());

        //入库
        save(brOpportunityCooperator);

        return brOpportunityCooperator;
    }


    @Override
    public BrOpportunityCooperator update(BrOpportunityCooperatorUpdateDTO dto) {

        //校验参数
        BrOpportunityCooperator old = checkExists(dto.getId());

        //封装数据
        BrOpportunityCooperator brOpportunityCooperator = new BrOpportunityCooperator();
        BeanUtils.copyProperties(dto, brOpportunityCooperator);
        brOpportunityCooperator.setCreatedAt(old.getCreatedAt())
                .setCreator(old.getCreator());

        //入库
        updateById(brOpportunityCooperator);

        return brOpportunityCooperator;
    }


    @Override
    public void delete(String id) {

        //校验参数
        BrOpportunityCooperator brOpportunityCooperator = checkExists(id);

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        List<BrOpportunityCooperator> brOpportunityCooperatorList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> brOpportunityCooperatorList.add(checkExists(id)));

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brOpportunityCooperator 实体
     * @return BrOpportunityCooperatorVO 结果集
     * @author ouyang
     * @date 2022-06-07
     */
    private BrOpportunityCooperatorVO translation(BrOpportunityCooperator brOpportunityCooperator) {
        BrOpportunityCooperatorVO vo = new BrOpportunityCooperatorVO();
        BeanUtils.copyProperties(brOpportunityCooperator, vo);

        //翻译协作人
        vo.setCooperatorStaff(staffService.find(brOpportunityCooperator.getExtCorpId(),brOpportunityCooperator.getCooperatorId()));

        return vo;
    }


    @Override
    public BrOpportunityCooperator checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrOpportunityCooperator byId = getById(id);
        if (byId == null) {
            throw new BaseException("商机-协作人关联不存在");
        }
        return byId;
    }
}
