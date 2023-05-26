package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.JwtUtil;
import com.scrm.server.wx.cp.entity.BrProductInfoImbue;
import com.scrm.server.wx.cp.service.IBrProductTypeService;
import com.scrm.server.wx.cp.service.IStaffService;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.BrProductInfo;
import com.scrm.server.wx.cp.mapper.BrProductInfoMapper;
import com.scrm.server.wx.cp.service.IBrProductInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.server.wx.cp.dto.BrProductInfoPageDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoSaveDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoUpdateDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoQueryDTO;
import com.scrm.server.wx.cp.vo.BrProductInfoVO;
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
 * 产品信息 服务实现类
 *
 * @author xxh
 * @since 2022-07-17
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrProductInfoServiceImpl extends ServiceImpl<BrProductInfoMapper, BrProductInfo> implements IBrProductInfoService {

    @Autowired
    private IBrProductTypeService productTypeService;

    @Autowired
    private IStaffService staffService;


    @Override
    public IPage<BrProductInfoVO> pageList(BrProductInfoPageDTO dto) {
        LambdaQueryWrapper<BrProductInfo> wrapper = new LambdaQueryWrapper<BrProductInfo>()
                .eq(BrProductInfo::getExtCorpId, dto.getExtCorpId())
                .eq(dto.getStatus() != null, BrProductInfo::getStatus, dto.getStatus())
                .eq(StringUtils.isNotBlank(dto.getProductTypeId()), BrProductInfo::getProductTypeId, dto.getProductTypeId())
                .like(StringUtils.isNotBlank(dto.getName()), BrProductInfo::getName, dto.getName())
                .orderByDesc(BrProductInfo::getUpdatedAt);
        IPage<BrProductInfo> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrProductInfoVO> queryList(BrProductInfoQueryDTO dto) {
        LambdaQueryWrapper<BrProductInfo> wrapper = new QueryWrapper<BrProductInfo>()
                .lambda().eq(BrProductInfo::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrProductInfoVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrProductInfo save(BrProductInfoSaveDTO dto) {

        //校重
        checkRepeat(dto.getExtCorpId(), null, dto.getName());
        productTypeService.checkExists(dto.getProductTypeId());
        List<BrProductInfoImbue> brProductInfoImbues = Optional.ofNullable(dto.getImbue()).orElse(new ArrayList<>());
        List<String> imbueNameList = Optional.ofNullable(dto.getImbue()).orElse(new ArrayList<>()).stream().map(BrProductInfoImbue::getName).distinct().collect(Collectors.toList());
        if (brProductInfoImbues.size() > imbueNameList.size()) {
            throw new BaseException("附加属性名称不能重复");
        }

        //封装数据
        BrProductInfo brProductInfo = new BrProductInfo();
        BeanUtils.copyProperties(dto, brProductInfo);
        brProductInfo.setId(UUID.get32UUID())
                .setCode(Optional.ofNullable(dto.getCode()).orElse(UUID.get32UUID()))
                .setUpdatedAt(new Date())
                .setCreator(JwtUtil.getUserId())
                .setCreatedAt(new Date());

        //入库
        save(brProductInfo);

        return brProductInfo;
    }


    @Override
    public BrProductInfo update(BrProductInfoUpdateDTO dto) {

        //校验参数
        BrProductInfo old = checkExists(dto.getId());
        checkRepeat(dto.getExtCorpId(), old.getId(), old.getName());
        productTypeService.checkExists(dto.getProductTypeId());
        List<BrProductInfoImbue> brProductInfoImbues = Optional.ofNullable(dto.getImbue()).orElse(new ArrayList<>());
        List<String> imbueNameList = Optional.ofNullable(dto.getImbue()).orElse(new ArrayList<>()).stream().map(BrProductInfoImbue::getName).distinct().collect(Collectors.toList());
        if (brProductInfoImbues.size() > imbueNameList.size()) {
            throw new BaseException("附加属性名称不能重复");
        }

        //封装数据
        BrProductInfo brProductInfo = new BrProductInfo();
        BeanUtils.copyProperties(dto, brProductInfo);

        brProductInfo.setCode(Optional.ofNullable(dto.getCode()).orElse(UUID.get32UUID()))
                .setCreatedAt(old.getCreatedAt())
                .setCreator(old.getCreator())
                .setUpdatedAt(new Date())
                .setEditor(JwtUtil.getUserId());

        //入库
        updateById(brProductInfo);

        return brProductInfo;
    }


    @Override
    public void delete(String id) {

        //校验参数
        checkExists(id);

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(this::checkExists);


        //删除
        removeByIds(dto.getIds());
    }

    /**
     * 校重
     *
     * @param extCorpId 企业ID
     * @param id        分类ID
     * @param name      分类名称
     */
    private void checkRepeat(String extCorpId, String id, String name) {
        if (OptionalLong.of(count(new LambdaQueryWrapper<BrProductInfo>()
                .eq(BrProductInfo::getExtCorpId, extCorpId)
                .ne(StringUtils.isNotBlank(id), BrProductInfo::getId, id)
                .eq(BrProductInfo::getName, name))).orElse(0) > 0) {
            throw new BaseException("该产品已存在，请勿重复添加");
        }
    }

    /**
     * 翻译
     *
     * @param brProductInfo 实体
     * @return BrProductInfoVO 结果集
     * @author xxh
     * @date 2022-07-17
     */
    private BrProductInfoVO translation(BrProductInfo brProductInfo) {
        BrProductInfoVO vo = new BrProductInfoVO();
        BeanUtils.copyProperties(brProductInfo, vo);
        vo.setCreatorStaff(staffService.find(brProductInfo.getCreator()))
                .setProductType(productTypeService.findById(brProductInfo.getProductTypeId()));
        return vo;
    }


    @Override
    public BrProductInfo checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrProductInfo byId = getById(id);
        if (byId == null) {
            throw new BaseException("产品信息不存在");
        }
        return byId;
    }

    @Override
    public synchronized void addViews(String id) {
        BrProductInfo brProductInfo = checkExists(id);
        update(new LambdaUpdateWrapper<BrProductInfo>()
                .eq(BrProductInfo::getId, id)
                .set(BrProductInfo::getViews, Optional.ofNullable(brProductInfo.getViews()).orElse(0L) + 1));
    }
}
