package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import com.scrm.api.wx.cp.entity.WxMsgTemplateDetail;
import com.scrm.api.wx.cp.enums.WxMsgSendStatusEnum;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.EverydayCountResDTO;
import com.scrm.server.wx.cp.entity.BrCustomerFollow;
import com.scrm.server.wx.cp.entity.BrOrder;
import com.scrm.server.wx.cp.entity.BrReportSale;
import com.scrm.server.wx.cp.mapper.BrReportSaleMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.vo.BrReportSaleVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 每日统计的报表 服务实现类
 * @author xxh
 * @since 2022-08-01
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrReportSaleServiceImpl extends ServiceImpl<BrReportSaleMapper, BrReportSale> implements IBrReportSaleService {
    
    @Autowired
    private IWxCustomerStaffService customerStaffService;
    
    @Autowired
    private IStaffService staffService;
    
    @Autowired
    private IBrCustomerFollowService customerFollowService;
    
    @Autowired
    private IBrOrderService orderService;
    
    @Autowired
    private IWxMsgTemplateDetailService wxMsgTemplateDetailService;
    
    /**
     * 翻译
     * @param brReportSale 实体
     * @return BrReportEverydayVO 结果集
     * @author xxh
     * @date 2022-08-01
     */
    private BrReportSaleVO translation(BrReportSale brReportSale){
        BrReportSaleVO vo = new BrReportSaleVO();
        BeanUtils.copyProperties(brReportSale, vo);
        return vo;
    }


    @Override
    public BrReportSale checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrReportSale byId = getById(id);
        if (byId == null) {
            throw new BaseException("每日统计的报表不存在");
        }
        return byId;
    }

    @Override
    public String buildTodayReport(String extCorpId) {
        
        //统计今天0点到20点的
        Calendar startCalendar = Calendar.getInstance();
        startCalendar.set(Calendar.HOUR_OF_DAY, 0);
        startCalendar.set(Calendar.MINUTE, 0);
        startCalendar.set(Calendar.SECOND, 0);

        Calendar endCalendar = Calendar.getInstance();
        endCalendar.set(Calendar.HOUR_OF_DAY, 20);
        endCalendar.set(Calendar.MINUTE, 0);
        endCalendar.set(Calendar.SECOND, 0);

        //开始结束时间
        Date start = startCalendar.getTime();
        Date end = endCalendar.getTime();
        
        List<Staff> staffList = staffService.list(new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, extCorpId));
        List<EverydayCountResDTO> countDate = staffList.stream().map(e -> {
            EverydayCountResDTO resDTO = new EverydayCountResDTO();
            resDTO.setStaff(e);
            return resDTO;
        }).collect(Collectors.toList());

        Map<String, EverydayCountResDTO> extStaffIdMap = countDate.stream().collect(
                Collectors.toMap(e -> e.getStaff().getExtId(), Function.identity()));
        //新增客户
        List<WxCustomerStaff> customerStaffs = customerStaffService.list(
                new QueryWrapper<WxCustomerStaff>().lambda()
                        .select(WxCustomerStaff::getExtStaffId)
                        .eq(WxCustomerStaff::getExtCorpId, extCorpId)
                        .le(WxCustomerStaff::getCreatedAt, end)
                        .ge(WxCustomerStaff::getCreatedAt, start));

        customerStaffs.forEach(e -> {
            EverydayCountResDTO resDTO = extStaffIdMap.get(e.getExtStaffId());
            if (resDTO != null) {
                resDTO.setAddCustomer(resDTO.getAddCustomer() + 1);
            }
        });
        
        //客户跟进
        List<BrCustomerFollow> follows = customerFollowService.list(new QueryWrapper<BrCustomerFollow>().lambda()
                .eq(BrCustomerFollow::getExtCorpId, extCorpId)
                .le(BrCustomerFollow::getCreatedAt, end)
                .ge(BrCustomerFollow::getCreatedAt, start));

        follows.forEach(e -> {
            EverydayCountResDTO resDTO = extStaffIdMap.get(e.getCreatorExtId());
            if (resDTO != null) {
                resDTO.getFollowList().add(e);
            }
        });

        //订单
        List<BrOrder> orderList = orderService.list(new QueryWrapper<BrOrder>().lambda()
                .select(BrOrder::getManagerStaffExtId, BrOrder::getOrderAmount)
                .eq(BrOrder::getExtCorpId, extCorpId)
                .le(BrOrder::getCreatedAt, end)
                .ge(BrOrder::getCreatedAt, start));
        
        orderList.forEach(e -> {
            EverydayCountResDTO resDTO = extStaffIdMap.get(e.getManagerStaffExtId());
            if (resDTO != null) {
                resDTO.setOrderNum(resDTO.getOrderNum() + 1);
                resDTO.setOrderAmount(resDTO.getOrderAmount() + Double.parseDouble(e.getOrderAmount()));
            }
        });
        
        //群发
        List<WxMsgTemplateDetail> msgTemplateDetails = wxMsgTemplateDetailService.list(
                new QueryWrapper<WxMsgTemplateDetail>().lambda()
                .eq(WxMsgTemplateDetail::getExtCorpId, extCorpId)
                .eq(WxMsgTemplateDetail::getSendStatus, WxMsgSendStatusEnum.STATUS_SEND.getCode())
                .le(WxMsgTemplateDetail::getSendTime, end)
                .ge(WxMsgTemplateDetail::getSendTime, start));
        
        List<String> msgIdList = new ArrayList<>();
        
        msgTemplateDetails.forEach(e -> {
            EverydayCountResDTO resDTO = extStaffIdMap.get(e.getExtStaffId());
            if (resDTO != null) {
                resDTO.setSendCustomer(resDTO.getSendCustomer() + 1);
                if (!msgIdList.contains(e.getExtMsgId())) {
                    resDTO.setSendNum(resDTO.getSendNum() + 1);
                    msgIdList.add(e.getExtMsgId());
                }
            }
        });

        BrReportSale reportEveryday = new BrReportSale()
                .setId(UUID.get32UUID())
                .setExtCorpId(extCorpId)
                .setCountData(countDate)
                .setCreatedAt(new Date());
                        
        save(reportEveryday);
        
        return reportEveryday.getId();
    }
}
