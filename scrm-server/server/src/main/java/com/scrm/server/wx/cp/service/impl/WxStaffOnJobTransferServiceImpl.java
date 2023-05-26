package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.scrm.api.wx.cp.dto.StaffOnJobTransferCustomerDTO;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import com.scrm.api.wx.cp.entity.WxStaffTransferInfo;
import com.scrm.api.wx.cp.enums.WxStaffTransferStatusEnum;
import com.scrm.api.wx.cp.vo.StaffTransferCustomerInfoVO;
import com.scrm.api.wx.cp.vo.StaffTransferCustomerVO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import com.scrm.server.wx.cp.service.IWxStaffOnJobTransferService;
import com.scrm.server.wx.cp.service.IWxStaffTransferInfoService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.WxCpUserTransferCustomerReq;
import me.chanjar.weixin.cp.bean.external.WxCpUserTransferCustomerResp;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class WxStaffOnJobTransferServiceImpl implements IWxStaffOnJobTransferService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IWxStaffTransferInfoService staffOnJobTransferInfoService;

    //不要添加事务，调用微信接口成功，就要添加一个流水记录
    @Override
    public StaffTransferCustomerVO transferCustomer(StaffOnJobTransferCustomerDTO dto) {

        List<StaffTransferCustomerVO> customerVOList = dto.getCustomerStaffIds().stream()
                .map(e -> transferCustomer(dto, e.getExtStaffId()))
                .collect(Collectors.toList());

        StaffTransferCustomerVO result = new StaffTransferCustomerVO();
        result.setFailList(new ArrayList<>());
        result.setSucceedList(new ArrayList<>());
        customerVOList.forEach(e -> {
            result.getSucceedList().addAll(e.getSucceedList());
            result.getFailList().addAll(e.getFailList());
        });
        result.setSucceedTotal(result.getSucceedList().size());
        result.setFailTotal(result.getFailList().size());

        return result;
    }

    private StaffTransferCustomerVO transferCustomer(StaffOnJobTransferCustomerDTO dto, String extStaffId) {
        StaffTransferCustomerVO vo = new StaffTransferCustomerVO();
        //校验参数
        Staff handoverStaff = staffService.checkExists(extStaffId, JwtUtil.getExtCorpId());
        Staff takeoverStaff = staffService.checkExists(dto.getTakeoverStaffId());

        List<String> customerIds = dto.getCustomerStaffIds().stream().map(WxCustomerStaff::getCustomerId).collect(Collectors.toList());

        //递归查询
        List<WxCustomer> wxCustomers = ListUtils.execute2List(e -> customerService.listByIds(e), customerIds, 999);
        if (ListUtils.isEmpty(wxCustomers) || wxCustomers.size() != customerIds.size()) {
            throw new BaseException("客户不存在");
        }

        //判断这个客户是否在移交中
        wxCustomers.forEach(wxCustomer -> {
            if (staffOnJobTransferInfoService.count(new LambdaQueryWrapper<WxStaffTransferInfo>()
                    .eq(WxStaffTransferInfo::getExtCorpId, dto.getExtCorpId())
                    .eq(WxStaffTransferInfo::getExtCorpId, wxCustomer.getExtId())
                    .eq(WxStaffTransferInfo::getStatus, 2)
            ) > 0) {
                throw new BaseException(String.format("%s客户正在接替中，不允许操作", wxCustomer.getName()));
            }

        });

        //转移客户列表
        List<StaffTransferCustomerInfoVO> staffTransferCustomerInfoVOS = new ArrayList<>();

        //调用企业微信接口：分配在职成员的客户
        wxCustomers = Optional.of(wxCustomers).orElse(new ArrayList<>()).stream().filter(customer -> StringUtils.isNotBlank(customer.getExtId())).collect(Collectors.toList());
        Map<String, WxCustomer> customerMap = wxCustomers.stream().collect(Collectors.toMap(WxCustomer::getExtId, o -> o));
        List<List<WxCustomer>> partitionList = ListUtils.partition(wxCustomers, 100);
        partitionList.forEach(customerList -> {
            WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
            WxCpUserTransferCustomerReq customerReq = new WxCpUserTransferCustomerReq();
            customerReq.setTransferMsg(dto.getTransferMsg());
            List<String> customerUserIds = customerList.stream().map(WxCustomer::getExtId).collect(Collectors.toList());
            customerReq.setExternalUserid(customerUserIds);
            customerReq.setHandOverUserid(handoverStaff.getExtId());
            customerReq.setTakeOverUserid(takeoverStaff.getExtId());
            WxCpUserTransferCustomerResp resp;
            try {
                resp = externalContactService.transferCustomer(customerReq);
                Optional.ofNullable(resp.getCustomer()).orElse(new ArrayList<>()).forEach(customer -> {
                    WxCustomer wxCustomer = Optional.ofNullable(customerMap.get(customer.getExternalUserid())).orElse(new WxCustomer());
                    StaffTransferCustomerInfoVO staffTransferCustomerInfoVO = new StaffTransferCustomerInfoVO()
                            .setCustomerId(wxCustomer.getId())
                            .setCustomerName(wxCustomer.getName())
                            .setErrCode(customer.getErrcode())
                            .setErrMsg(BaseException.getErrorMsgByCode(customer.getErrcode(), null));
                    staffTransferCustomerInfoVOS.add(staffTransferCustomerInfoVO);

                    //保存成功提交的流水
                    if (customer.getErrcode() == 0) {
                        WxStaffTransferInfo staffTransferInfo = new WxStaffTransferInfo()
                                .setId(UUID.get32UUID())
                                .setExtCorpId(dto.getExtCorpId())
                                .setType(WxStaffTransferInfo.TYPE_ON_JOB)
                                .setTakeoverStaffExtId(takeoverStaff.getExtId())
                                .setHandoverStaffExtId(handoverStaff.getExtId())
                                .setCustomerExtId(wxCustomer.getExtId())
                                .setCreateTime(new Date())
                                .setStatus(WxStaffTransferStatusEnum.WAITING_TO_TAKE_OVER.getValue());
                        staffOnJobTransferInfoService.save(staffTransferInfo);
                    }

                });
            } catch (WxErrorException e) {
                staffTransferCustomerInfoVOS.addAll(customerList.stream().map(customer -> new StaffTransferCustomerInfoVO()
                        .setCustomerName(customer.getName())
                        .setCustomerId(customer.getId())
                        .setErrMsg(e.getError().getErrorMsgEn())
                        .setErrCode(e.getError().getErrorCode())
                ).collect(Collectors.toList()));
                log.error("调用企业微信接口异常，请求参数：【{}】，异常信息：【{}】", customerReq, e.getError().toString(), e);
            }

        });

        List<StaffTransferCustomerInfoVO> succeedList = Optional.of(staffTransferCustomerInfoVOS).orElse(new ArrayList<>()).stream().filter(infoVO -> infoVO.getErrCode() == 0).collect(Collectors.toList());
        vo.setSucceedList(succeedList)
                .setFailList(Optional.of(staffTransferCustomerInfoVOS).orElse(new ArrayList<>()).stream().filter(infoVO -> infoVO.getErrCode() != 0).collect(Collectors.toList()))
                .setSucceedTotal(vo.getSucceedList().size())
                .setFailTotal(vo.getFailList().size());

        return vo;
    }


}
