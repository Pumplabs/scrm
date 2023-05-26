package com.scrm.server.wx.cp.service.impl;

import com.scrm.api.wx.cp.enums.SysSwitchCodeEnum;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.api.wx.cp.dto.SysSwitchUpdateDTO;
import lombok.extern.slf4j.Slf4j;
import com.scrm.api.wx.cp.entity.SysSwitch;
import com.scrm.server.wx.cp.mapper.SysSwitchMapper;
import com.scrm.server.wx.cp.service.ISysSwitchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.api.wx.cp.dto.SysSwitchQueryDTO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;


/**
 * 服务实现类
 *
 * @author xxh
 * @since 2022-03-26
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class SysSwitchServiceImpl extends ServiceImpl<SysSwitchMapper, SysSwitch> implements ISysSwitchService {


    @Override
    public List<SysSwitch> queryList(SysSwitchQueryDTO dto) {

        List<SysSwitch> result = new ArrayList<>();
        Optional.ofNullable(dto.getCodeList()).orElse(new ArrayList<>()).forEach(code ->
                result.add(getByCode(dto.getExtCorpId(), code))
        );
        return result;
    }

    @Override
    public SysSwitch getByCode(String extCorpId, String code) {

        SysSwitch sysSwitch = getOne(new LambdaQueryWrapper<SysSwitch>()
                .eq(SysSwitch::getExtCorpId, extCorpId)
                .eq(SysSwitch::getCode, code));

        //如果为空新增一条
        if (sysSwitch == null) {
            sysSwitch = new SysSwitch().setCode(code)
                    .setDetails(SysSwitchCodeEnum.getName(code))
                    .setCreateTime(new Date())
                    .setExtCorpId(extCorpId)
                    .setStatus(0)
                    .setUpdateTime(new Date());
            save(sysSwitch);
        }
        return sysSwitch;
    }

    @Override
    public SysSwitch update(SysSwitchUpdateDTO dto) {
        SysSwitch sysSwitch = getById(dto.getId());
        if (sysSwitch == null || !sysSwitch.getExtCorpId().equals(dto.getExtCorpId())) {
            throw new BaseException("该系统开关不存在" );
        }
        sysSwitch.setStatus(dto.getStatus())
                .setUpdateTime(new Date())
                .setEditor(JwtUtil.getUserId());
        updateById(sysSwitch);
        return sysSwitch;
    }

}
