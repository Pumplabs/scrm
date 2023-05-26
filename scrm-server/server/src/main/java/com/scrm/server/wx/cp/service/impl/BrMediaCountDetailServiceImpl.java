package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.server.wx.cp.entity.BrMediaCountDetail;
import com.scrm.server.wx.cp.mapper.BrMediaCountDetailMapper;
import com.scrm.server.wx.cp.service.IBrMediaCountDetailService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 素材统计表详情 服务实现类
 * @author xxh
 * @since 2022-05-17
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrMediaCountDetailServiceImpl extends ServiceImpl<BrMediaCountDetailMapper, BrMediaCountDetail> implements IBrMediaCountDetailService {

    @Override
    public BrMediaCountDetail checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrMediaCountDetail byId = getById(id);
        if (byId == null) {
            throw new BaseException("素材统计表详情不存在");
        }
        return byId;
    }
}
