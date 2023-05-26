package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxCustomerStaffTag;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.mapper.WxCustomerStaffTagMapper;
import com.scrm.server.wx.cp.service.IWxCustomerStaffTagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 服务实现类
 *
 * @author xxh
 * @since 2022-01-02
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxCustomerStaffTagServiceImpl extends ServiceImpl<WxCustomerStaffTagMapper, WxCustomerStaffTag> implements IWxCustomerStaffTagService {

    @Override
    public void batchDelete(BatchDTO<String> tagExtIds) {
        if (ListUtils.isEmpty(tagExtIds.getIds())) {
            return;
        }
        update(new LambdaUpdateWrapper<WxCustomerStaffTag>()
                .set(WxCustomerStaffTag::getHasDelete, null)
                .in(WxCustomerStaffTag::getExtTagId, tagExtIds.getIds())
        );
    }
}
