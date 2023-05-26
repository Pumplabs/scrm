package com.scrm.server.wx.cp.service.impl;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.WxCustomerStaffAssistSaveOrUpdateDTO;
import com.scrm.server.wx.cp.service.IStaffService;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.WxCustomerStaffAssist;
import com.scrm.server.wx.cp.mapper.WxCustomerStaffAssistMapper;
import com.scrm.server.wx.cp.service.IWxCustomerStaffAssistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.server.wx.cp.dto.WxCustomerStaffAssistQueryDTO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;

import java.util.*;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.stream.Collectors;

/**
 * 客户-员工跟进协助人 服务实现类
 *
 * @author xxh
 * @since 2022-08-02
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxCustomerStaffAssistServiceImpl extends ServiceImpl<WxCustomerStaffAssistMapper, WxCustomerStaffAssist> implements IWxCustomerStaffAssistService {

    @Autowired
    private IStaffService staffService;

    @Override
    public List<Staff> queryStaffAssistList(WxCustomerStaffAssistQueryDTO dto) {
        LambdaQueryWrapper<WxCustomerStaffAssist> wrapper = new QueryWrapper<WxCustomerStaffAssist>().lambda()
                .eq(WxCustomerStaffAssist::getExtCorpId, dto.getExtCorpId())
                .eq(WxCustomerStaffAssist::getExtStaffId, dto.getExtStaffId())
                .eq(WxCustomerStaffAssist::getExtCustomerId, dto.getExtCustomerId())
                .orderByDesc(WxCustomerStaffAssist::getUpdatedAt);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(wxCustomerStaffAssist ->
                staffService.findByExtId(wxCustomerStaffAssist.getExtCorpId(), wxCustomerStaffAssist.getAssistExtStaffId())).collect(Collectors.toList());
    }


    @Override
    public void saveOrUpdate(WxCustomerStaffAssistSaveOrUpdateDTO dto) {
        Optional.ofNullable(dto.getAssistExtStaffIdList()).orElse(new ArrayList<>()).forEach(assistExtStaffId -> {

            WxCustomerStaffAssist old = getOne(new LambdaQueryWrapper<WxCustomerStaffAssist>()
                    .eq(WxCustomerStaffAssist::getExtCorpId, dto.getExtCorpId())
                    .eq(WxCustomerStaffAssist::getExtStaffId, dto.getExtStaffId())
                    .eq(WxCustomerStaffAssist::getExtCustomerId, dto.getExtCustomerId())
                    .eq(WxCustomerStaffAssist::getAssistExtStaffId, assistExtStaffId));

            if (Objects.nonNull(old)) {
                old.setUpdatedAt(new Date());
                updateById(old);
            } else {
                //封装数据
                WxCustomerStaffAssist wxCustomerStaffAssist = new WxCustomerStaffAssist();
                BeanUtils.copyProperties(dto, wxCustomerStaffAssist);
                wxCustomerStaffAssist.setId(UUID.get32UUID())
                        .setAssistExtStaffId(assistExtStaffId)
                        .setCreatedAt(new Date())
                        .setUpdatedAt(new Date());
                save(wxCustomerStaffAssist);
            }
        });


    }

    @Override
    public void remove(WxCustomerStaffAssistSaveOrUpdateDTO dto) {
        remove(new LambdaQueryWrapper<WxCustomerStaffAssist>()
                .eq(WxCustomerStaffAssist::getExtCorpId, dto.getExtCorpId())
                .eq(WxCustomerStaffAssist::getExtStaffId, dto.getExtStaffId())
                .eq(WxCustomerStaffAssist::getExtCustomerId, dto.getExtCustomerId())
                .in(ListUtils.isNotEmpty(dto.getAssistExtStaffIdList()), WxCustomerStaffAssist::getAssistExtStaffId, dto.getAssistExtStaffIdList())
        );
    }


}
