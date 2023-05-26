package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.JwtUtil;
import com.scrm.server.wx.cp.entity.BrJourneyStageCustomer;
import com.scrm.server.wx.cp.entity.BrProductInfo;
import com.scrm.server.wx.cp.service.IBrProductInfoService;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.BrProductType;
import com.scrm.server.wx.cp.mapper.BrProductTypeMapper;
import com.scrm.server.wx.cp.service.IBrProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.server.wx.cp.dto.BrProductTypePageDTO;
import com.scrm.server.wx.cp.dto.BrProductTypeSaveDTO;
import com.scrm.server.wx.cp.dto.BrProductTypeUpdateDTO;
import com.scrm.server.wx.cp.dto.BrProductTypeQueryDTO;
import com.scrm.server.wx.cp.vo.BrProductTypeVO;
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
 * 产品分类 服务实现类
 *
 * @author xxh
 * @since 2022-07-17
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrProductTypeServiceImpl extends ServiceImpl<BrProductTypeMapper, BrProductType> implements IBrProductTypeService {

    @Autowired
    private IBrProductInfoService productInfoService;

    @Override
    public IPage<BrProductTypeVO> pageList(BrProductTypePageDTO dto) {
        LambdaQueryWrapper<BrProductType> wrapper = new QueryWrapper<BrProductType>()
                .lambda().eq(BrProductType::getExtCorpId, dto.getExtCorpId())
                .orderByDesc(BrProductType::getUpdatedAt);
        IPage<BrProductType> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrProductTypeVO> queryList(BrProductTypeQueryDTO dto) {
        LambdaQueryWrapper<BrProductType> wrapper = new QueryWrapper<BrProductType>()
                .lambda().eq(BrProductType::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrProductTypeVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrProductType save(BrProductTypeSaveDTO dto) {

        //校重
        checkRepeat(dto.getExtCorpId(), null, dto.getName());

        //封装数据
        BrProductType brProductType = new BrProductType();
        BeanUtils.copyProperties(dto, brProductType);
        brProductType.setId(UUID.get32UUID())
                .setUpdatedAt(new Date())
                .setCreatedAt(new Date())
                .setCreator(JwtUtil.getUserId());

        //入库
        save(brProductType);

        return brProductType;
    }


    @Override
    public BrProductType update(BrProductTypeUpdateDTO dto) {

        //校验参数
        BrProductType old = checkExists(dto.getId());
        checkRepeat(dto.getExtCorpId(), old.getId(), old.getName());

        //封装数据
        BrProductType brProductType = new BrProductType();
        BeanUtils.copyProperties(dto, brProductType);
        brProductType.setCreatedAt(old.getCreatedAt())
                .setCreator(old.getCreator())
                .setUpdatedAt(new Date())
                .setEditor(JwtUtil.getUserId());

        //入库
        updateById(brProductType);

        return brProductType;
    }

    /**
     * 校重
     *
     * @param extCorpId 企业ID
     * @param id        分类ID
     * @param name      分类名称
     */
    private void checkRepeat(String extCorpId, String id, String name) {
        if (OptionalLong.of(count(new LambdaQueryWrapper<BrProductType>()
                .eq(BrProductType::getExtCorpId, extCorpId)
                .ne(StringUtils.isNotBlank(id), BrProductType::getId, id)
                .eq(BrProductType::getName, name))).orElse(0) > 0) {
            throw new BaseException("该产品分类已存在，请勿重复添加");
        }
    }


    @Override
    public void delete(String id) {

        //校验参数
        BrProductType brProductType = checkExists(id);
        if (OptionalLong.of(productInfoService.count(new LambdaQueryWrapper<BrProductInfo>()
                .eq(BrProductInfo::getExtCorpId, brProductType.getExtCorpId())
                .eq(BrProductInfo::getProductTypeId, brProductType.getId()))).orElse(0) > 0) {
            throw new BaseException("该分类下还存在产品，请移除完产品后，再进行删除操作");
        }

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        List<BrProductType> list = Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).stream()
                .map(this::checkExists).collect(Collectors.toList());
        List<String> typeIds = list.stream().map(BrProductType::getId).collect(Collectors.toList());
        if (OptionalLong.of(productInfoService.count(new LambdaQueryWrapper<BrProductInfo>()
                .eq(BrProductInfo::getExtCorpId, list.get(0).getExtCorpId())
                .in(BrProductInfo::getProductTypeId, typeIds))).orElse(0) > 0) {
            throw new BaseException("所选分类下还存在产品，请移除完产品后，再进行删除操作");
        }

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brProductType 实体
     * @return BrProductTypeVO 结果集
     * @author xxh
     * @date 2022-07-17
     */
    private BrProductTypeVO translation(BrProductType brProductType) {
        BrProductTypeVO vo = new BrProductTypeVO();
        BeanUtils.copyProperties(brProductType, vo);
        return vo.setProductNum(productInfoService.count(new LambdaUpdateWrapper<BrProductInfo>()
                .eq(BrProductInfo::getExtCorpId,brProductType.getExtCorpId())
                .eq(BrProductInfo::getProductTypeId,brProductType.getId())));
    }


    @Override
    public BrProductType checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrProductType byId = getById(id);
        if (byId == null) {
            throw new BaseException("产品分类不存在");
        }
        return byId;
    }
}
