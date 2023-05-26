package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.MpAppIdDTO;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.entity.BrMpAccredit;
import com.scrm.server.wx.cp.mapper.BrMpAccreditMapper;
import com.scrm.server.wx.cp.service.IBrMpAccreditService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 微信第三方平台授权信息 服务实现类
 * @author xxh
 * @since 2022-04-30
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrMpAccreditServiceImpl extends ServiceImpl<BrMpAccreditMapper, BrMpAccredit> implements IBrMpAccreditService {


    @Override
    public BrMpAccredit checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrMpAccredit byId = getById(id);
        if (byId == null) {
            throw new BaseException("微信第三方平台授权信息不存在");
        }
        return byId;
    }

    @Override
    public List<BrMpAccredit> getMpAccreditList(String extCorpId) {
        return list(new QueryWrapper<BrMpAccredit>().lambda()
                .eq(BrMpAccredit::getExtCorpId, extCorpId)
                .orderByDesc(BrMpAccredit::getUpdatedAt));
    }

    @Override
    public String getIdByAppId(String extCorpId, String appId) {
        BrMpAccredit accredit = getOne(new QueryWrapper<BrMpAccredit>().lambda()
                .eq(BrMpAccredit::getExtCorpId, extCorpId)
                .eq(BrMpAccredit::getAuthorizerAppId, appId), false);
        return Optional.ofNullable(accredit)
                .orElse(new BrMpAccredit())
                .getId();
    }

    @Override
    public MpAppIdDTO getAppInfo(String extCorpId) {
        List<BrMpAccredit> accreditList = list(new QueryWrapper<BrMpAccredit>().lambda()
                .eq(BrMpAccredit::getExtCorpId, extCorpId));

        if (ListUtils.isEmpty(accreditList)) {
            throw new BaseException("您没有授权公众号，请先授权公众号");
        }


        return new MpAppIdDTO()
                .setMpAppId(accreditList.get(0).getAuthorizerAppId())
                .setComponentAppId(ScrmConfig.getMpAppId());
    }

    @Override
    public MpAppIdDTO getAppInfoPrivate(String extCorpId) {
//        List<BrMpAccredit> accreditList = list(new QueryWrapper<BrMpAccredit>().lambda()
//                .eq(BrMpAccredit::getExtCorpId, extCorpId));
//
//        if (ListUtils.isEmpty(accreditList)) {
//            throw new BaseException("您没有授权公众号，请先授权公众号");
//        }


        return new MpAppIdDTO()
                .setMpAppId(ScrmConfig.getMpAppId())
                .setComponentAppId("tset");
    }
}
