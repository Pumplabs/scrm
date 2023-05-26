package com.scrm.server.wx.cp.service.impl;

import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.WxCustomerTagAddInfo;
import com.scrm.server.wx.cp.mapper.WxCustomerTagAddInfoMapper;
import com.scrm.server.wx.cp.service.IWxCustomerTagAddInfoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.api.wx.cp.dto.*;

import com.scrm.server.wx.cp.dto.WxCustomerTagAddInfoSaveDTO;
import com.scrm.server.wx.cp.dto.WxCustomerTagAddInfoUpdateDTO;

import com.scrm.server.wx.cp.dto.WxCustomerTagAddInfoQueryDTO;
import com.scrm.server.wx.cp.vo.WxCustomerTagAddInfoVO;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import java.util.stream.Collectors;

/**
 * 企业微信客户-批量添加标签明细 服务实现类
 * @author xxh
 * @since 2022-04-12
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxCustomerTagAddInfoServiceImpl extends ServiceImpl<WxCustomerTagAddInfoMapper, WxCustomerTagAddInfo> implements IWxCustomerTagAddInfoService {


    @Override
    public List<WxCustomerTagAddInfoVO> queryList(WxCustomerTagAddInfoQueryDTO dto){
        LambdaQueryWrapper<WxCustomerTagAddInfo> wrapper = new QueryWrapper<WxCustomerTagAddInfo>()
        .lambda().eq(WxCustomerTagAddInfo::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public WxCustomerTagAddInfoVO findById(String id){
        return translation(checkExists(id));
    }


    @Override
    public WxCustomerTagAddInfo save(WxCustomerTagAddInfoSaveDTO dto){

        //封装数据
        WxCustomerTagAddInfo wxCustomerTagAddInfo = new WxCustomerTagAddInfo();
        BeanUtils.copyProperties(dto,wxCustomerTagAddInfo);
        wxCustomerTagAddInfo.setId(UUID.get32UUID());

        //入库
        save(wxCustomerTagAddInfo);

        return wxCustomerTagAddInfo;
    }


    @Override
    public WxCustomerTagAddInfo update(WxCustomerTagAddInfoUpdateDTO dto){

        //校验参数
        WxCustomerTagAddInfo old = checkExists(dto.getId());

        //封装数据
        WxCustomerTagAddInfo wxCustomerTagAddInfo = new WxCustomerTagAddInfo();
        BeanUtils.copyProperties(dto, wxCustomerTagAddInfo);


        //入库
        updateById(wxCustomerTagAddInfo);

        return wxCustomerTagAddInfo;
    }




    /**
     * 翻译
     * @param wxCustomerTagAddInfo 实体
     * @return WxCustomerTagAddInfoVO 结果集
     * @author xxh
     * @date 2022-04-12
     */
    private WxCustomerTagAddInfoVO translation(WxCustomerTagAddInfo wxCustomerTagAddInfo){
        WxCustomerTagAddInfoVO vo = new WxCustomerTagAddInfoVO();
        BeanUtils.copyProperties(wxCustomerTagAddInfo, vo);
        return vo;
    }


    @Override
    public WxCustomerTagAddInfo checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxCustomerTagAddInfo byId = getById(id);
        if (byId == null) {
            throw new BaseException("企业微信客户-批量添加标签明细不存在");
        }
        return byId;
    }
}
