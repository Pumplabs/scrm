package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.BrCorpSeeDTO;
import com.scrm.api.wx.cp.dto.CorpInfoDTO;
import com.scrm.api.wx.cp.entity.StaffDepartment;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.entity.BrCorpAccredit;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.config.WxCpTpConfiguration;
import com.scrm.server.wx.cp.feign.CpTpFeign;
import com.scrm.server.wx.cp.feign.dto.*;
import com.scrm.server.wx.cp.mapper.BrCorpAccreditMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.vo.SeatStaffVO;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpTagService;
import me.chanjar.weixin.cp.api.WxCpUserService;
import me.chanjar.weixin.cp.api.impl.WxCpTagServiceImpl;
import me.chanjar.weixin.cp.api.impl.WxCpUserServiceImpl;
import me.chanjar.weixin.cp.bean.WxCpTagGetResult;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 企业授权信息 服务实现类
 * @author xxh
 * @since 2022-04-10
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrCorpAccreditServiceImpl extends ServiceImpl<BrCorpAccreditMapper, BrCorpAccredit> implements IBrCorpAccreditService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private CpTpFeign cpTpFeign;

    @Autowired
    private WxCpTpConfiguration wxCpTpConfiguration;

    @Autowired
    private RedissonClient redissonClient;

    @Autowired
    private IStaffDepartmentService staffDepartmentService;

    @Autowired
    private IDepartmentService departmentService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    @Override
    public BrCorpAccredit checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrCorpAccredit byId = getById(id);
        if (byId == null) {
            throw new BaseException("企业授权信息不存在");
        }
        return byId;
    }

    @Override
    public BrCorpAccredit getByCorpId(String corpId) {

        try {
            List<BrCorpAccredit> accreditList = list(new QueryWrapper<BrCorpAccredit>().lambda()
                    .eq(BrCorpAccredit::getCorpId, corpId)
                    .orderByDesc(BrCorpAccredit::getCreatedAt));
            BrCorpAccredit brCorpAccredit = new BrCorpAccredit();
            brCorpAccredit.setCorpId(ScrmConfig.getExtCorpID());
            return brCorpAccredit;
        }catch (RuntimeException e){

            log.error("获取企业[{}]授权码失败", corpId, e);
            throw new BaseException("获取企业授权码失败");
        }

    }

    @Override
    public Integer getAgentIdByCorpId(String corpId) {

        BrCorpAccredit accredit = getByCorpId(corpId);

        try {
            return accredit.getAuthInfo().getAgents().get(0).getAgentId();
        }catch (NullPointerException e){
            log.error("[{}]获取agentId失败", corpId, e);
            throw new BaseException("获取授权信息失败！");
        }

    }

    @Override
    public String getCorpNameByCorpId(String corpId) {

        BrCorpAccredit accredit = getByCorpId(corpId);

        try {
            return ScrmConfig.getCorpName();
//            return accredit.getAuthCorpInfo().getCorpName();
        }catch (NullPointerException e){
            log.error("[{}]获取CorpName失败", corpId, e);
            throw new BaseException("获取授权信息失败！");
        }
    }

    @Override
    public void registerCorpInfo(CorpInfoDTO dto) {
        //先更新密钥数据
//        BrCorpAccredit brCorpAccredit = checkExists(dto.getId());
//
//        BeanUtils.copyProperties(dto, brCorpAccredit);
//
//        updateById(brCorpAccredit);
//
//        try {
//            //同步员工信息
//            staffService.sync(brCorpAccredit.getCorpId());
//
//            //同步客户信息和标签信息
//            customerService.sync(brCorpAccredit.getCorpId());
//        }catch (Exception e){
//            log.error("（授权完成）同步员工和客户信息失败，数据=[{}], ", JSON.toJSONString(dto), e);
//            throw new BaseException("同步员工信息和客户信息失败，请检查密钥是否填写正确！");
//        }

    }

    @Override
    public void deleteByCorpId(String authCorpId) {
        remove(new QueryWrapper<BrCorpAccredit>().lambda().eq(BrCorpAccredit::getCorpId, authCorpId));
    }

    @Override
    public void update(String corpId) throws WxErrorException {
        //更新企业授权信息
        BrCorpAccredit corpAccredit = getByCorpId(corpId);
        String permanentCode = corpAccredit.getPermanentCode();

        GetAuthInfoParams params = new GetAuthInfoParams();
        params.setAuth_corpid(corpId)
                .setPermanent_code(permanentCode);

        WxCpTpService wxCpTpService = new WxCpTpServiceImpl();
        wxCpTpService.setWxCpTpConfigStorage(wxCpTpConfiguration.getBaseConfig());

        GetAuthInfoRes authInfo = cpTpFeign.getAuthInfo(params, wxCpTpService.getSuiteAccessToken());

        BrCorpAccredit accredit = getByCorpId(corpId);
        accredit.setAuthCorpInfo(changeAuthCorpInfo(authInfo.getAuth_corp_info()))
                .setAuthInfo(changeAuthInfo(authInfo.getAuth_info()));

        log.info("[{}]企业授权信息变更为：[{}]", corpId, JSON.toJSONString(accredit));
        updateById(accredit);

    }

    @Override
    public BrCorpSeeDTO getSeeByCorpId(String extCorpId) {
        if (StringUtils.isBlank(extCorpId)) {
            return new BrCorpSeeDTO();
        }

        BrCorpAccredit accredit = getOne(new QueryWrapper<BrCorpAccredit>().lambda()
                .eq(BrCorpAccredit::getCorpId, extCorpId), false);

        if (accredit == null) {
            throw new BaseException("找不到该企业的授权信息");
        }

        //获取授权信息
        WxCpTpPermanentCodeInfo.Privilege privilege;
        try {
            privilege = accredit.getAuthInfo().getAgents().get(0).getPrivilege();
        }catch (RuntimeException e){
            log.error("[{}]获取该企业的授权信息异常", extCorpId, e);
            throw new BaseException("获取该企业的授权信息异常");
        }

        BrCorpSeeDTO result = new BrCorpSeeDTO();

        //加到结果里
        if (ListUtils.isNotEmpty(privilege.getAllowUsers())) {
            result.getStaffExtIds().addAll(privilege.getAllowUsers());
        }

        if (ListUtils.isNotEmpty(privilege.getAllowParties())) {
            result.getDeptExtIds().addAll(privilege.getAllowParties());
        }

        if (ListUtils.isNotEmpty(privilege.getAllowTags())) {

            WxCpTagService tagService = new WxCpTagServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

            privilege.getAllowTags().forEach(tag -> {

                WxCpTagGetResult tagGetResult = new WxCpTagGetResult();
                try {
                    tagGetResult = tagService.get(tag.toString());
                } catch (WxErrorException e) {
                    log.error("获取标签[{}]失败，", tag, e);
                }
                if (ListUtils.isNotEmpty(tagGetResult.getUserlist())) {
                    tagGetResult.getUserlist().forEach(u ->
                            result.getStaffExtIds().add(u.getUserId())
                    );
                }

                if (ListUtils.isNotEmpty(tagGetResult.getPartylist())) {
                    tagGetResult.getPartylist().forEach(p ->
                            result.getDeptExtIds().add(p));
                }
            });


        }
        return result;
    }

    @Override
    public List<String> getSeeStaffFromRedis(String corpId, boolean forceFlush) {

        //如果corpId传null，表示是所有
        if (StringUtils.isBlank(corpId)) {
            List<BrCorpAccredit> list = list(new QueryWrapper<BrCorpAccredit>().lambda()
                    .select(BrCorpAccredit::getCorpId));

            list.forEach(e -> getSeeStaffFromRedis(e.getCorpId(), forceFlush));
            return new ArrayList<>();
        }

        //每个公司来计算
        String key = Constants.CORP_ACCREDIT_REDIS_PRE + corpId;
        RBucket<String> bucket = redissonClient.getBucket(key);
        String accreditStr;
        if (forceFlush || bucket == null || (accreditStr = bucket.get()) == null){
            BrCorpSeeDTO seeDTO = getSeeByCorpId(corpId);

            //加上员工
            List<String> result = new ArrayList<>(seeDTO.getStaffExtIds());

            //加上部门的
            if (ListUtils.isNotEmpty(seeDTO.getDeptExtIds())) {

                List<Long> deptIds = seeDTO.getDeptExtIds().stream().map(e -> e.longValue()).collect(Collectors.toList());

                List<Long> childIdList = departmentService.getChildIdList(corpId, deptIds);

                List<StaffDepartment> staffDeptList = staffDepartmentService.list(new QueryWrapper<StaffDepartment>().lambda()
                        .eq(StaffDepartment::getExtCorpId, corpId)
                        .in(StaffDepartment::getExtDepartmentId, childIdList));

                staffDeptList.forEach(e -> result.add(e.getExtStaffId()));
            }

            //写入reids
            bucket.set(JSON.toJSONString(result));
            return result;
        }
        return JSON.parseArray(accreditStr, String.class);
    }

    @Override
    public SeatStaffVO getSeeStaff(String extCorpId) {
        BrCorpSeeDTO seeByCorpId = getSeeByCorpId(extCorpId);
        
        Set<String> staffExtIds = new HashSet<>();
        //有授权人
        if (ListUtils.isNotEmpty(seeByCorpId.getStaffExtIds())) {
            staffExtIds.addAll(seeByCorpId.getStaffExtIds());
        }
        
        //授权部门
        if (ListUtils.isNotEmpty(seeByCorpId.getDeptExtIds())) {
            WxCpUserService userService = new WxCpUserServiceImpl(wxCpConfiguration.getAddressBookWxCpService());

            seeByCorpId.getDeptExtIds().forEach(e -> {

                List<WxCpUser> wxCpUsers = new ArrayList<>();
                try {
                    wxCpUsers = userService.listSimpleByDepartment(e.longValue(), false, 0);
                } catch (WxErrorException ex) {
                    log.error("根据部门拿员工信息失败");
                }
                wxCpUsers.forEach(u -> staffExtIds.add(u.getUserId()));

            });
        }
        
        return new SeatStaffVO().setExtCorpId(extCorpId).setExtStaffIds(staffExtIds);
    }

    private WxCpTpPermanentCodeInfo.AuthInfo changeAuthInfo(AuthInfo params) {
        WxCpTpPermanentCodeInfo.AuthInfo result = new WxCpTpPermanentCodeInfo.AuthInfo();

        List<WxCpTpPermanentCodeInfo.Agent> agents = params.getAgent().stream()
                .map(e -> {

                    WxCpTpPermanentCodeInfo.Agent res = new WxCpTpPermanentCodeInfo.Agent();
                    res.setAgentId(e.getAgentid());
                    res.setName(e.getName());
                    res.setRoundLogoUrl(e.getRound_logo_url());
                    res.setSquareLogoUrl(e.getSquare_logo_url());
                    res.setAppid(e.getEdition_id());
                    res.setAuthMode(e.getAuth_mode());
                    res.setIsCustomizedApp(e.getIs_customized_app());
                    res.setPrivilege(changePrivilege(e.getPrivilege()));

//                    res. setEditionId(e.getEdition_id());
//                    res.setEditionName(e.getEdition_name());
//                    res.setAppStatus(e.getApp_status());
//                    res.setUserLimit(e.getUser_limit());
//                    res.setExpiredTime(e.getExpired_time());
//                    res.setIsVirtualVersion(e.getIs_virtual_version());
//                    res.setIsSharedFromOtherCorp(e.getIs_shared_from_other_corp());
                    return res;

                })
                .collect(Collectors.toList());
        result.setAgents(agents);

        return result;
    }

    /**
     * 转换这个不知道什么信息
     * @param params
     * @return
     */
    private WxCpTpPermanentCodeInfo.Privilege changePrivilege(Privilege params) {

        WxCpTpPermanentCodeInfo.Privilege result = new WxCpTpPermanentCodeInfo.Privilege();
        result.setLevel(params.getLevel());
        result.setAllowParties(params.getAllow_party());
        result.setAllowUsers(params.getAllow_user());
        result.setAllowTags(params.getAllow_tag());
        result.setExtraParties(params.getExtra_party());
        result.setExtraUsers(params.getExtra_user());
        result.setExtraTags(params.getExtra_tag());
        return result;
    }

    /**
     * 转换授权企业信息
     * @param params
     * @return
     */
    private WxCpTpPermanentCodeInfo.AuthCorpInfo changeAuthCorpInfo(AuthCorpInfo params) {
        WxCpTpPermanentCodeInfo.AuthCorpInfo result = new WxCpTpPermanentCodeInfo.AuthCorpInfo();

        result.setCorpId(params.getCorpid());
        result.setCorpName(params.getCorp_name());
        result.setCorpType(params.getCorp_type());
        result.setCorpSquareLogoUrl(params.getCorp_square_logo_url());
        result.setCorpRoundLogoUrl(params.getCorp_round_logo_url());
        result.setCorpUserMax(params.getCorp_user_max());
        result.setCorpAgentMax(params.getCorp_agent_max());
        result.setCorpFullName(params.getCorp_full_name());
        result.setVerifiedEndTime(params.getVerified_end_time());
        result.setSubjectType(params.getSubject_type());
        result.setCorpWxQrcode(params.getCorp_wxqrcode());
        result.setCorpScale(params.getCorp_scale());
        result.setCorpIndustry(params.getCorp_industry());
        result.setCorpSubIndustry(params.getCorp_sub_industry());
        result.setLocation(params.getLocation());
        return result;
    }
}
