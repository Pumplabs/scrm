package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.dto.BrOrderProductSaveOrUpdateDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoSaveDTO;
import com.scrm.server.wx.cp.entity.BrProductInfo;
import com.scrm.server.wx.cp.service.IBrProductInfoService;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.BrOrderProduct;
import com.scrm.server.wx.cp.mapper.BrOrderProductMapper;
import com.scrm.server.wx.cp.service.IBrOrderProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.server.wx.cp.dto.BrOrderProductPageDTO;
import com.scrm.server.wx.cp.dto.BrOrderProductQueryDTO;
import com.scrm.server.wx.cp.vo.BrOrderProductVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.stream.Collectors;

/**
 * 订单-产品关联 服务实现类
 *
 * @author xxh
 * @since 2022-07-25
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrOrderProductServiceImpl extends ServiceImpl<BrOrderProductMapper, BrOrderProduct> implements IBrOrderProductService {

    @Autowired
    private IBrProductInfoService productInfoService;

    @Override
    public IPage<BrOrderProductVO> pageList(BrOrderProductPageDTO dto) {
        LambdaQueryWrapper<BrOrderProduct> wrapper = new QueryWrapper<BrOrderProduct>()
                .lambda().eq(BrOrderProduct::getExtCorpId, dto.getExtCorpId());
        IPage<BrOrderProduct> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrOrderProductVO> queryList(BrOrderProductQueryDTO dto) {
        LambdaQueryWrapper<BrOrderProduct> wrapper = new QueryWrapper<BrOrderProduct>()
                .lambda().eq(BrOrderProduct::getExtCorpId, dto.getExtCorpId())
                .eq(BrOrderProduct::getOrderId, dto.getOrderId())
                .orderByAsc(BrOrderProduct::getCreatedAt);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrOrderProductVO findById(String id) {
        return translation(checkExists(id));
    }


    /**
     * 翻译
     *
     * @param brOrderProduct 实体
     * @return BrOrderProductVO 结果集
     * @author xxh
     * @date 2022-07-25
     */
    private BrOrderProductVO translation(BrOrderProduct brOrderProduct) {
        BrOrderProductVO vo = new BrOrderProductVO();
        BeanUtils.copyProperties(brOrderProduct, vo);
        if (StringUtils.isNotBlank(brOrderProduct.getProductId())) {
            vo.setProductInfo(productInfoService.findById(brOrderProduct.getProductId()));
        }
        return vo;
    }


    @Override
    public BrOrderProduct checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrOrderProduct byId = getById(id);
        if (byId == null) {
            throw new BaseException("订单-产品关联不存在");
        }
        return byId;
    }

    @Override
    public List<BrOrderProduct> batchSaveOrUpdate(String orderId, List<BrOrderProductSaveOrUpdateDTO> productList) {

        List<BrOrderProduct> result = new ArrayList<>();

        productList = Optional.ofNullable(productList).orElse(new ArrayList<>());

        //删除不存在的数据
        List<String> ids = productList.stream().map(BrOrderProductSaveOrUpdateDTO::getId).filter(StringUtils::isNotBlank).distinct().collect(Collectors.toList());
        remove(new LambdaUpdateWrapper<BrOrderProduct>()
                .eq(BrOrderProduct::getExtCorpId, JwtUtil.getExtCorpId())
                .eq(BrOrderProduct::getOrderId, orderId)
                .notIn(ListUtils.isNotEmpty(ids), BrOrderProduct::getId, ids));

        //批量新增
        List<BrOrderProduct> saveList = productList.stream().filter(orderProductSaveOrUpdateDTO -> StringUtils.isBlank(orderProductSaveOrUpdateDTO.getId()))
                .map(orderProductSaveOrUpdateDTO -> {
                    BrOrderProduct orderProduct = new BrOrderProduct();
                    BeanUtils.copyProperties(orderProductSaveOrUpdateDTO, orderProduct);
                    if (StringUtils.isNotBlank(orderProductSaveOrUpdateDTO.getProductId())) {
                        BrProductInfo brProductInfo = productInfoService.checkExists(orderProductSaveOrUpdateDTO.getProductId());
                        orderProduct.setProductName(brProductInfo.getName())
                                .setProductPrice(brProductInfo.getPrice());
                    }
                    return orderProduct.setOrderId(orderId)
                            .setCreatedAt(new Date())
                            .setUpdatedAt(new Date())
                            .setCreator(JwtUtil.getUserId())
                            .setDiscount(StringUtils.isBlank(orderProductSaveOrUpdateDTO.getDiscount()) ? "1" : orderProductSaveOrUpdateDTO.getDiscount())
                            .setExtCorpId(JwtUtil.getExtCorpId())
                            .setId(UUID.get32UUID());
                }).collect(Collectors.toList());

        if (ListUtils.isNotEmpty(saveList)) {
            saveBatch(saveList);
            result.addAll(saveList);
        }

        //批量修改
        List<BrOrderProduct> updateList = productList.stream().filter(orderProductSaveOrUpdateDTO -> StringUtils.isNotBlank(orderProductSaveOrUpdateDTO.getId()))
                .map(orderProductSaveOrUpdateDTO -> {
                    BrOrderProduct orderProduct = new BrOrderProduct();
                    BrOrderProduct old = checkExists(orderProductSaveOrUpdateDTO.getId());
                    BeanUtils.copyProperties(orderProductSaveOrUpdateDTO, orderProduct);
                    if (StringUtils.isNotBlank(orderProductSaveOrUpdateDTO.getProductId())) {
                        BrProductInfo brProductInfo = productInfoService.checkExists(orderProductSaveOrUpdateDTO.getProductId());
                        orderProduct.setProductName(brProductInfo.getName())
                                .setProductPrice(brProductInfo.getPrice());
                    }
                    return orderProduct.setOrderId(orderId)
                            .setCreatedAt(old.getCreatedAt())
                            .setCreator(old.getCreator())
                            .setUpdatedAt(new Date())
                            .setEditor(JwtUtil.getUserId())
                            .setDiscount(StringUtils.isBlank(orderProductSaveOrUpdateDTO.getDiscount()) ? "1" : orderProductSaveOrUpdateDTO.getDiscount())
                            .setExtCorpId(JwtUtil.getExtCorpId());
                }).collect(Collectors.toList());

        if (ListUtils.isNotEmpty(updateList)) {
            updateBatchById(updateList);
            result.addAll(updateList);
        }

        return result;
    }

    @Override
    public void batchDeleteByOrderIds(List<String> orderIds) {
        if (ListUtils.isNotEmpty(orderIds)) {
            remove(new LambdaQueryWrapper<BrOrderProduct>().in(BrOrderProduct::getOrderId,orderIds));
        }
    }
}
