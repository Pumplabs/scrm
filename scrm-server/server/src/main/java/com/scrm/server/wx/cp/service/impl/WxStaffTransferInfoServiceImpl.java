package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.enums.WxStaffTransferStatusEnum;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.api.wx.cp.vo.WxGroupChatVO;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import lombok.extern.slf4j.Slf4j;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxStaffTransferInfo;
import com.scrm.server.wx.cp.mapper.WxStaffTransferInfoMapper;
import com.scrm.server.wx.cp.service.IWxStaffTransferInfoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scrm.api.wx.cp.vo.WxStaffTransferInfoVO;

import java.util.Collections;
import java.util.Date;
import java.util.Objects;

/**
 * 员工在职转接记录 服务实现类
 *
 * @author xxh
 * @since 2022-03-05
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxStaffTransferInfoServiceImpl extends ServiceImpl<WxStaffTransferInfoMapper, WxStaffTransferInfo> implements IWxStaffTransferInfoService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IWxGroupChatService groupChatService;

    @Override
    public IPage<WxStaffTransferInfoVO> pageList(WxStaffTransferInfoPageDTO dto) {


        LambdaQueryWrapper<WxStaffTransferInfo> wrapper = new QueryWrapper<WxStaffTransferInfo>().lambda()
                .eq(dto.getStatus() != null, WxStaffTransferInfo::getStatus, dto.getStatus())
                .ge(dto.getBeginTime() != null, WxStaffTransferInfo::getCreateTime, dto.getBeginTime())
                .le(dto.getEndTime() != null, WxStaffTransferInfo::getCreateTime, dto.getEndTime())
                .orderByDesc(WxStaffTransferInfo::getCreateTime);

        if (StringUtils.isNotBlank(dto.getStaffId())) {
            Staff staff = staffService.find(dto.getStaffId());
            wrapper.eq(Objects.nonNull(staff), WxStaffTransferInfo::getHandoverStaffExtId, staff.getExtId());
        }
        IPage<WxStaffTransferInfo> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }

    @Override
    public void transferFail(WxCpXmlOutMessageDTO dto) {
        //1、获取接替记录
        WxStaffTransferInfo staffTransferInfo = getOne(new LambdaQueryWrapper<WxStaffTransferInfo>()
                .eq(WxStaffTransferInfo::getExtCorpId, dto.getExtCorpId())
                .eq(WxStaffTransferInfo::getCustomerExtId, dto.getExternalUserId())
                .eq(WxStaffTransferInfo::getTakeoverStaffExtId, dto.getUserId()
                )
        );

        //2、修改记录
        if (staffTransferInfo != null) {
            staffTransferInfo.setTakeoverTime(new Date(dto.getCreateTime()))
                    .setStatus(WxStaffTransferStatusEnum.getValue(dto.getFailReason()));
            updateById(staffTransferInfo);
        }
    }

    @Override
    public IPage<WxCustomerVO> waitTransferCustomerPage(WxWaitTransferCustomerPageDTO dto) {
        IPage<WxCustomer> page = baseMapper.waitTransferCustomerPage(new Page<>(dto.getPageNum(), dto.getPageSize()), dto);
        return page.convert(customerService::translation);
    }

    @Override
    public IPage<WxGroupChatVO> waitTransferGroupChatPage(WxWaitTransferGroupChatPageDTO dto) {
        Staff staff = staffService.find(dto.getStaffId());
        WxGroupChatPageDTO pageDTO = new WxGroupChatPageDTO();
        pageDTO.setPageNum(dto.getPageNum());
        pageDTO.setPageSize(dto.getPageSize());
        pageDTO.setExtCorpId(dto.getExtCorpId());
        pageDTO.setOwnerExtIds(Collections.singletonList(staff.getExtId()));
        pageDTO.setName(dto.getKeyword());
        return groupChatService.pageList(pageDTO);
    }

    /**
     * 翻译
     *
     * @param wxStaffTransferInfo 实体
     * @return WxStaffTransferInfoVO 结果集
     * @author xxh
     * @date 2022-03-05
     */
    private WxStaffTransferInfoVO translation(WxStaffTransferInfo wxStaffTransferInfo) {
        WxStaffTransferInfoVO vo = new WxStaffTransferInfoVO();
        BeanUtils.copyProperties(wxStaffTransferInfo, vo);
        return vo.setHandover(staffService.translation(staffService.find(wxStaffTransferInfo.getExtCorpId(), vo.getHandoverStaffExtId())))
                .setTakeover(staffService.translation(staffService.find(wxStaffTransferInfo.getExtCorpId(), vo.getTakeoverStaffExtId())))
                .setCustomer(customerService.translation(customerService.find(wxStaffTransferInfo.getExtCorpId(), vo.getCustomerExtId())));
    }


}
