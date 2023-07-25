package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrOpportunity;
import com.scrm.server.wx.cp.entity.BrOrder;
import com.scrm.server.wx.cp.entity.BrOrderAttachment;
import com.scrm.server.wx.cp.entity.BrOrderProduct;
import com.scrm.server.wx.cp.mapper.BrOrderMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.ReportUtil;
import com.scrm.server.wx.cp.vo.BrOrderVO;
import com.scrm.server.wx.cp.vo.DailyTotalVO;
import com.scrm.server.wx.cp.vo.TopNStatisticsVo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 订单 服务实现类
 *
 * @author xxh
 * @since 2022-07-17
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrOrderServiceImpl extends ServiceImpl<BrOrderMapper, BrOrder> implements IBrOrderService {

    @Autowired
    private ISysRoleStaffService roleStaffService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IBrProductInfoService productInfoService;

    @Autowired
    private IBrOrderProductService orderProductService;

    @Autowired
    private IWxTempFileService fileService;

    @Override
    public IPage<BrOrderVO> pageList(BrOrderPageDTO dto) {
        LambdaQueryWrapper<BrOrder> wrapper = new LambdaQueryWrapper<BrOrder>()
                .eq(BrOrder::getExtCorpId, dto.getExtCorpId())
                .eq(dto.getStatus() != null, BrOrder::getStatus, dto.getStatus())
                .eq(!roleStaffService.isEnterpriseAdmin(), BrOrder::getManagerStaffExtId, JwtUtil.getExtUserId())
                .like(StringUtils.isNotBlank(dto.getOrderCode()), BrOrder::getOrderCode, dto.getOrderCode())
                .orderByDesc(BrOrder::getUpdatedAt);
        IPage<BrOrder> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrOrderVO> queryList(BrOrderQueryDTO dto) {
        LambdaQueryWrapper<BrOrder> wrapper = new QueryWrapper<BrOrder>().lambda().eq(BrOrder::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrOrderVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrOrderVO save(BrOrderSaveDTO dto) {

        //封装数据
        BrOrder brOrder = new BrOrder();
        BeanUtils.copyProperties(dto, brOrder);
        String orderId = UUID.get32UUID();

        //新增订单产品关联
        List<BrOrderProduct> orderProducts = orderProductService.batchSaveOrUpdate(orderId, dto.getProductList());

        //封装数据
        brOrder.setId(orderId)
                .setDiscount(StringUtils.isBlank(dto.getDiscount()) ? "1" : dto.getDiscount())
                .setOrderCode(buildCode())
                .setUpdatedAt(new Date())
                .setCreator(JwtUtil.getUserId())
                .setCreatedAt(new Date())
                .setStatus(roleStaffService.isEnterpriseAdmin() ? BrOrder.STATUS_HAS_IDENTIFIED : BrOrder.STATUS_PENDING_REVIEW)
                .setOrderAmount(getOrderAmount(orderProducts, dto.getDiscount()).toString());
        //入库
        save(brOrder);

        return findById(orderId);
    }


    @Override
    public BrOrder update(BrOrderUpdateDTO dto) {

        dto.setDiscount(StringUtils.isBlank(dto.getDiscount()) ? "1" : dto.getDiscount());

        //校验参数
        BrOrder old = checkExists(dto.getId());
        if (!Arrays.asList(BrOrder.STATUS_PENDING_REVIEW,
                BrOrder.STATUS_HAS_IDENTIFIED,
                BrOrder.STATUS_FINISHED,
                BrOrder.STATUS_AUDIT_FAILED).contains(dto.getStatus())) {
            throw new BaseException("订单状态非法" );
        }
        if (Arrays.asList(BrOrder.STATUS_HAS_IDENTIFIED,
                BrOrder.STATUS_FINISHED,
                BrOrder.STATUS_AUDIT_FAILED).contains(dto.getStatus()) &&
                !roleStaffService.isEnterpriseAdmin()) {
            throw new BaseException("操作非法" );
        }

        if (Objects.equals(old.getStatus(), BrOrder.STATUS_HAS_IDENTIFIED)) {
            if (!roleStaffService.isEnterpriseAdmin()) {
                throw new BaseException("订单处于已确认状态，请联系管理员修改" );
            }
        } else if (Objects.equals(old.getStatus(), BrOrder.STATUS_FINISHED)) {
            throw new BaseException("订单处于已完成不允许修改" );
        } else if (Objects.equals(old.getStatus(), BrOrder.STATUS_AUDIT_FAILED)) {
            //如果是审核不通过，修改了之后就变成待审核状态
            dto.setStatus(BrOrder.STATUS_PENDING_REVIEW);
        }

        //新增订单产品关联
        List<BrOrderProduct> orderProducts = orderProductService.batchSaveOrUpdate(dto.getId(), dto.getProductList());

        //设置定时金额
        dto.setOrderAmount(getOrderAmount(orderProducts, dto.getDiscount()).toString());

        //如果订单状态为已确定，且订单金额 = 收款金额 则将订单状态设置为已完成
        if (Objects.equals(dto.getStatus(), BrOrder.STATUS_HAS_IDENTIFIED) &&
                (Double.parseDouble(StringUtils.isBlank(dto.getCollectionAmount()) ? "0" : dto.getCollectionAmount()) - Double.parseDouble(StringUtils.isBlank(dto.getOrderAmount()) ? "0" : dto.getOrderAmount())) >= 0) {
            dto.setStatus(BrOrder.STATUS_FINISHED);
        }

        //封装数据
        BrOrder order = new BrOrder();
        BeanUtils.copyProperties(dto, order);
        order.setCreatedAt(old.getCreatedAt()).setCreator(old.getCreator()).setUpdatedAt(new Date()).setEditor(JwtUtil.getUserId());

        //入库
        updateById(order);

        return order;
    }

    private BigDecimal getOrderAmount(List<BrOrderProduct> orderProducts, String discount) {
        BigDecimal orderAmount = new BigDecimal("0" );
        if (ListUtils.isNotEmpty(orderProducts)) {
            orderAmount = orderProducts.stream().map(product -> StringUtils.isBlank(product.getProductPrice()) ? BigDecimal.ZERO :
                    new BigDecimal(product.getProductPrice()).multiply(new BigDecimal(product.getProductNum())).multiply(new BigDecimal(product.getDiscount()))).reduce(BigDecimal.ZERO, BigDecimal::add);
            orderAmount = orderAmount.multiply(new BigDecimal(discount));
        }
        return orderAmount;
    }


    @Override
    public void delete(String id) {

        //校验参数
        BrOrder brOrder = checkExists(id);

        //删除订单-商品
        orderProductService.batchDeleteByOrderIds(Collections.singletonList(brOrder.getId()));

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        if (ListUtils.isEmpty(dto.getIds())) {
            return;
        }

        //校验参数
        dto.getIds().forEach(this::checkExists);

        //删除订单-商品
        orderProductService.batchDeleteByOrderIds(dto.getIds());

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brOrder 实体
     * @return BrOrderVO 结果集
     * @author xxh
     * @date 2022-07-17
     */
    private BrOrderVO translation(BrOrder brOrder) {
        brOrder.setOrderAmount(format2(brOrder.getOrderAmount()))
                .setCollectionAmount(format2(brOrder.getCollectionAmount()));
        BrOrderVO vo = new BrOrderVO();
        BeanUtils.copyProperties(brOrder, vo);

        //前端需要返回附件大小,下面这样写会报错，暂时找不出原因
//        if (ListUtils.isNotEmpty(vo.getAttachments())) {
//            vo.getAttachments().forEach(e -> e.setSize(fileService.checkExists(e.getId()).getSize()));
//        }
        if (ListUtils.isNotEmpty(vo.getAttachments())) {
            String str = JSON.toJSONString(vo.getAttachments());
            List<BrOrderAttachment> attachments = JSON.parseArray(str, BrOrderAttachment.class);
            attachments.forEach(e -> e.setSize(fileService.checkExists(e.getId()).getSize()));
            vo.setAttachments(attachments);
        }

        return vo.setOrderProductList(orderProductService.queryList(new BrOrderProductQueryDTO().setExtCorpId(brOrder.getExtCorpId()).setOrderId(brOrder.getId())))
                .setCreatorStaff(staffService.find(brOrder.getCreator()))
                .setManagerStaff(staffService.find(brOrder.getExtCorpId(), brOrder.getManagerStaffExtId()))
                .setCustomer(customerService.find(brOrder.getExtCorpId(), brOrder.getCustomerExtId()));
    }

    public static String format2(String value) {
        if (StringUtils.isBlank(value)) {
            return "0.00";
        }
        DecimalFormat df = new DecimalFormat("0.00" );
        df.setRoundingMode(RoundingMode.HALF_UP);
        return df.format(Double.valueOf(value));
    }


    @Override
    public BrOrder checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrOrder byId = getById(id);
        if (byId == null) {
            throw new BaseException("订单不存在" );
        }
        return byId;
    }

    private synchronized String buildCode() {
        return System.currentTimeMillis() + "";
    }

    @Override
    public Long getAddedCountByDate(Date date, String extCorpId) {
        return baseMapper.addedByDate(date, extCorpId);
    }


    public List<Map<String, Object>> countByDateAndCorp(Date date) {
        return this.baseMapper.countByDateAndCorp(date);
    }

    @Override
    public List<TopNStatisticsVo> getStaffTotalAmountByDates(String extCorpId, Integer dates, Integer topN) {
        return baseMapper.getStaffTotalAmountByDates(extCorpId, dates, topN);
    }


    @Override
    public Long countByDateAndStaff() {
        String extStaffId = JwtUtil.getExtUserId();
        String extCorpId = JwtUtil.getExtCorpId();
        Date startTime = DateUtils.getYesterdayTime(true);
        Date endTime = DateUtils.getYesterdayTime(false);
        return count(new QueryWrapper<BrOrder>().lambda()
                .eq(BrOrder::getExtCorpId, extCorpId)
                .eq(BrOrder::getManagerStaffExtId, extStaffId)
                .ge(BrOrder::getCreatedAt, startTime).le(BrOrder::getCreatedAt, endTime));
    }


    @Override
    public Long countByToday() {
        Date startTime = DateUtils.getTodayStartTime();
        Date endTime = new Date();
        return count(new QueryWrapper<BrOrder>().lambda()
                .eq(BrOrder::getExtCorpId, JwtUtil.getExtCorpId())
                .ge(BrOrder::getCreatedAt, startTime).le(BrOrder::getCreatedAt, endTime)
                .eq(!staffService.isAdmin(), BrOrder::getCreator, JwtUtil.getUserId()).or(w -> {
                    w.eq(BrOrder::getManagerStaffExtId, JwtUtil.getExtUserId());
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
