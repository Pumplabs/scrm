package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxContactExpiration;
import com.scrm.api.wx.cp.vo.IdVO;
import com.scrm.common.constant.Constants;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.XxlJobInfoDTO;
import com.scrm.server.wx.cp.mapper.WxContactExpirationMapper;
import com.scrm.server.wx.cp.service.IContactWayService;
import com.scrm.server.wx.cp.service.IWxContactExpirationService;
import com.scrm.server.wx.cp.service.IXxlJobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 渠道码，过期时间表 服务实现类
 * @author xxh
 * @since 2022-03-22
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxContactExpirationServiceImpl extends ServiceImpl<WxContactExpirationMapper, WxContactExpiration> implements IWxContactExpirationService {

    @Autowired
    private IXxlJobService xxlJobService;

    @Autowired
    private IContactWayService contactWayService;

    @Override
    public void saveOrUpdate(String extCorpId, String configId, String groupId, Date expire) {

        WxContactExpiration expiration = getOne(new QueryWrapper<WxContactExpiration>().lambda()
                .eq(WxContactExpiration::getExtCorpId, extCorpId)
                .eq(WxContactExpiration::getConfigId, configId), false);

        //更新
        if (expiration != null) {
            expiration.setExpirationTime(expire)
            .setUpdatedAt(new Date());
            updateById(expiration);
            return;
        }

        //新增
        expiration = new WxContactExpiration()
                .setId(UUID.get32UUID())
                .setExpirationTime(expire)
                .setConfigId(configId)
                .setExtCorpId(extCorpId)
                .setGroupId(groupId)
                .setHasDelete(false)
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date());

        save(expiration);
    }

    @Override
    public Integer createJob(String extCorpId, String groupId, Date codeExpiredTime) {

        IdVO params = new IdVO()
                .setExtCorpId(extCorpId)
                .setId(groupId);

        XxlJobInfoDTO xxlJobInfoDTO = new XxlJobInfoDTO();
        xxlJobInfoDTO.setJobDesc("应用宝渠道码过期定时器")
                .setAuthor("--").setExecutorHandler(Constants.FISSION_CONTACT_EXPIRE_HANDLER)
                .setExecutorParam(JSON.toJSONString(params)).setCron(DateUtils.getCron(codeExpiredTime));

        Integer jobId = xxlJobService.addOrUpdate(xxlJobInfoDTO);
        xxlJobService.start(jobId);

        update(null, new UpdateWrapper<WxContactExpiration>().lambda()
                .eq(WxContactExpiration::getExtCorpId, extCorpId)
                .eq(WxContactExpiration::getGroupId, groupId)
                .set(WxContactExpiration::getExpirationTime, codeExpiredTime)
                .set(WxContactExpiration::getJobId, jobId));

        return jobId;
    }

    @Override
    public void handleExpiration(String extCorpId, String groupId) {

        //查出全部configId
        List<WxContactExpiration> expirationList = list(new QueryWrapper<WxContactExpiration>().lambda()
                .eq(WxContactExpiration::getExtCorpId, extCorpId)
                .eq(WxContactExpiration::getGroupId, groupId));

        List<String> configList = expirationList.stream().map(WxContactExpiration::getConfigId)
                .distinct().collect(Collectors.toList());

        boolean result = true;
        try {
            contactWayService.deleteByConfigIds(extCorpId, configList);
        }catch (Exception e){
            log.error("任务宝的渠道活码过期失败,[{}], [{},]", extCorpId, groupId, e);
            result = false;
        }

        update(new UpdateWrapper<WxContactExpiration>().lambda()
                .eq(WxContactExpiration::getExtCorpId, extCorpId)
                .eq(WxContactExpiration::getGroupId, groupId)
                .set(WxContactExpiration::getHasDelete, result));
    }
}
