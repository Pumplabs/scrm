package com.scrm.server.wx.cp.service.impl;

import lombok.extern.slf4j.Slf4j;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxCustomerInfo;
import com.scrm.server.wx.cp.mapper.WxCustomerInfoMapper;
import com.scrm.server.wx.cp.service.IWxCustomerInfoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * 企业微信客户详情信息 服务实现类
 * @author xxh
 * @since 2021-12-22
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxCustomerInfoServiceImpl extends ServiceImpl<WxCustomerInfoMapper, WxCustomerInfo> implements IWxCustomerInfoService {

    @Override
    public WxCustomerInfo find(String extCorpId, String customerExtId, String staffExtId) {
        return baseMapper.find(extCorpId,customerExtId,staffExtId);
    }
}
