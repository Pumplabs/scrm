package com.scrm.server.wx.cp.service.impl;

import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import lombok.extern.slf4j.Slf4j;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxGroupChatTransferInfo;
import com.scrm.server.wx.cp.mapper.WxGroupChatTransferInfoMapper;
import com.scrm.server.wx.cp.service.IWxGroupChatTransferInfoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scrm.api.wx.cp.dto.WxGroupChatTransferInfoPageDTO;
import com.scrm.api.wx.cp.vo.WxGroupChatTransferInfoVO;

/**
 * 微信群聊-离职继承详情 服务实现类
 *
 * @author xxh
 * @since 2022-03-12
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxGroupChatTransferInfoServiceImpl extends ServiceImpl<WxGroupChatTransferInfoMapper, WxGroupChatTransferInfo> implements IWxGroupChatTransferInfoService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxGroupChatService groupChatService;

    @Override
    public IPage<WxGroupChatTransferInfoVO> pageList(WxGroupChatTransferInfoPageDTO dto) {
        LambdaQueryWrapper<WxGroupChatTransferInfo> wrapper = new QueryWrapper<WxGroupChatTransferInfo>().lambda().eq(WxGroupChatTransferInfo::getExtCorpId, dto.getExtCorpId()).eq(StringUtils.isNotBlank(dto.getStaffExtId()), WxGroupChatTransferInfo::getHandoverStaffExtId, dto.getStaffExtId()).ge(dto.getBeginTime() != null, WxGroupChatTransferInfo::getCreateTime, dto.getBeginTime()).le(dto.getEndTime() != null, WxGroupChatTransferInfo::getCreateTime, dto.getEndTime()).orderByDesc(WxGroupChatTransferInfo::getCreateTime);
        IPage<WxGroupChatTransferInfo> page = page(dto, wrapper);
        return page.convert(this::translation);
    }


    /**
     * 翻译
     *
     * @param wxGroupChatTransferInfo 实体
     * @return WxGroupChatTransferInfoVO 结果集
     * @author xxh
     * @date 2022-03-12
     */
    private WxGroupChatTransferInfoVO translation(WxGroupChatTransferInfo wxGroupChatTransferInfo) {
        WxGroupChatTransferInfoVO vo = new WxGroupChatTransferInfoVO();
        BeanUtils.copyProperties(wxGroupChatTransferInfo, vo);
        return vo.setTakeoverStaff(staffService.translation(staffService.find(wxGroupChatTransferInfo.getExtCorpId(), wxGroupChatTransferInfo.getTakeoverStaffExtId()))).setHandoverStaff(staffService.translation(staffService.find(wxGroupChatTransferInfo.getHandoverStaffExtId()))).setGroupChat(groupChatService.translation(groupChatService.find(vo.getExtCorpId(), wxGroupChatTransferInfo.getGroupChatExtId())));
    }


}
