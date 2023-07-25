package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.scrm.api.wx.cp.entity.BrJourney;
import com.scrm.api.wx.cp.entity.BrJourneyStage;
import com.scrm.api.wx.cp.entity.Role;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.vo.WxLoginParamsResVo;
import com.scrm.api.wx.cp.vo.WxStaffResVo;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.entity.BrCorpAccredit;
import com.scrm.common.entity.SysRoleStaff;
import com.scrm.common.exception.BaseException;
import com.scrm.common.exception.CommonExceptionCode;
import com.scrm.common.util.CharacterUtils;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.config.WxCpTpConfiguration;
import com.scrm.common.entity.SysRole;
import com.scrm.server.wx.cp.feign.CpTpFeign;
import com.scrm.server.wx.cp.feign.dto.GetUserDetailRes;
import com.scrm.server.wx.cp.feign.dto.GetUserInfoRes;
import com.scrm.server.wx.cp.service.*;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpOAuth2Service;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.impl.WxCpOAuth2ServiceImpl;
import me.chanjar.weixin.cp.api.impl.WxCpServiceImpl;
import me.chanjar.weixin.cp.bean.WxCpOauth2UserInfo;
import me.chanjar.weixin.cp.bean.WxCpTpUserDetail;
import me.chanjar.weixin.cp.bean.WxTpLoginInfo;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/12 0:26
 * @description：扫码登录相关接口
 **/
@Service
@Slf4j
@Transactional
public class LoginServiceImpl implements ILoginService {

    private Map<String, String> userMap = new HashMap<>();

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IRoleService roleService;


    @Autowired
    private ISysRoleService sysRoleService;

    @Autowired
    private ISysRoleStaffService sysRoleStaffService;

    @Autowired
    private CpTpFeign cpTpFeign;

    @Autowired
    private WxCpTpConfiguration wxCpTpConfiguration;

    @Value("${scrm.loginCallback}")
    private String loginCallback;

    @Value("${scrm.loginType}")
    private String loginType;

    @Autowired
    private IBrCorpAccreditService accreditService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    @Autowired
    private RedissonClient redissonClient;


    @Autowired
    private IBrJourneyService journeyService;


    @Autowired
    private IBrJourneyStageService journeyStageService;


    @Override
    public WxLoginParamsResVo login() {
        WxLoginParamsResVo resVo = new WxLoginParamsResVo();
        resVo.setAppId(ScrmConfig.getExtCorpID());
        resVo.setAgentId(ScrmConfig.getMainAgentID());
        log.info("main agent id is = {}",ScrmConfig.getMainAgentID()) ;
        resVo.setRedirectUri(ScrmConfig.getLoginRedirectUrl());
        resVo.setState(CharacterUtils.getRandomString(10));
        resVo.setLocationUrl(String.format("https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=%s&agentid=%d&redirect_uri=%s&state=%s", resVo.getAppId(), resVo.getAgentId(), resVo.getRedirectUri(), resVo.getState()));
        return resVo;
    }

    @Override
    public void loginBack(String code, String state, String appid, HttpServletResponse response) {
        log.info("接收到回调函数=[{}], [{}], [{}]", code, state, appid);
        try {
            WxCpOAuth2Service wxCpOAuth2Service = new WxCpOAuth2ServiceImpl(WxCpConfiguration.getWxCpService());
            WxCpOauth2UserInfo userInfo = wxCpOAuth2Service.getUserInfo(ScrmConfig.getMainAgentID(), code);
            tryAvatar(userInfo.getUserTicket());
            log.info("用户信息=[{}]", JSON.toJSONString(userInfo));
            userMap.put(state, userInfo.getUserId());
        } catch (Exception e) {
            log.error("用户登录回调出错：", e);
        }
        response.addHeader("Access-Control-Expose-Headers", "location");
        response.addHeader("location", "/staff-admin/login-callback");
        //下面这个不行，会带上127.0.0.1:9900
//        try {
//            response.sendRedirect("staff-admin/login-callback");
//        } catch (IOException e) {
//            log.error("重定向失败,", e);
//        }

    }

    /**
     * 尝试获取头像
     *
     * @param userTicket
     */
    private void tryAvatar(String userTicket) {
        if (StringUtils.isBlank(userTicket)) {
            log.info("userTicket为空，不尝试获取头像");
            return;
        }
        try {
            GetUserDetailRes detail = cpTpFeign.getUserDetail(userTicket, WxCpConfiguration.getWxCpService().getAccessToken());
            log.info("detail", JSON.toJSONString(detail));
            detail.checkNoZero();
            staffService.update(new UpdateWrapper<Staff>().lambda()
                    .set(Staff::getAvatarUrl, detail.getAvatar())
                    .set(Staff::getGender, detail.getGender())
                    .set(Staff::getEmail, detail.getEmail())
                    .eq(Staff::getExtCorpId, ScrmConfig.getExtCorpID())
                    .eq(Staff::getExtId, detail.getUserid()));
        } catch (Exception e) {
            log.error("尝试获取头像异常，[{}],", userTicket, e);
        }
    }

    @Override
    public WxStaffResVo getCurrentStaff() {
        Staff staff = staffService.checkExists(JwtUtil.getExtUserId(), JwtUtil.getExtCorpId());
        if (staff == null) {
            return null;
        }
        return getStaffByExtId(staff.getExtId(), JwtUtil.getHasWeb());
    }

    private void initialize(String extId) {
        Staff staff = new Staff()
                .setId(UUID.get32UUID())
                .setExtCorpId(ScrmConfig.getExtCorpID())
                .setExtId(extId)
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date())
                .setIsAdmin(true);
        staffService.save(staff);
        SysRole sysRole = new SysRole();
        sysRole.setRoleKey(Constants.SYS_ROLE_KEY_ENTERPRISE_ADMIN)
                .setCreator(staff.getId())
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date())
                .setRoleName("管理员").setRoleSort(1).setStatus("1");
        sysRoleService.save(sysRole);
        SysRoleStaff sysRoleStaff = new SysRoleStaff();
        sysRoleStaff.setRoleId(sysRole.getId()).setExtStaffId(staff.getExtId()).setId(UUID.get32UUID())
                .setCreatedAt(new Date()).setExtCorpId(staff.getExtCorpId());
        sysRoleStaffService.save(sysRoleStaff);
        initCustomerJourney(ScrmConfig.getExtCorpID(),staff.getId());

    }

    private void initCustomerJourney(String extCorpId,String userId) {
        Long count = journeyService.count(new QueryWrapper<BrJourney>().lambda().eq(BrJourney::getExtCorpId, extCorpId));
        if (count == 0) {
            Date date = new Date();
            BrJourney brJourney = new BrJourney()
                    .setCreatedAt(date)
                    .setUpdatedAt(date)
                    .setExtCorpId(extCorpId)
                    .setName("系统默认")
                    .setCreator(userId)
                    .setId(UUID.get32UUID());
            journeyService.save(brJourney);
            String[] stageNames = new String[]{"关注", "意向", "商机", "购买", "粉丝"};
            AtomicReference<Integer> n = new AtomicReference<>(0);
            List<BrJourneyStage> brJourneyStageList = Arrays.stream(stageNames).map((stageName) -> {
                n.set(n.get() + 1);
                BrJourneyStage brJourneyStage = new BrJourneyStage()
                        .setJourneyId(brJourney.getId())
                        .setName(stageName)
                        .setExtCorpId(extCorpId)
                        .setSort(n.get())
                        .setCreator(userId)
                        .setCreatedAt(date)
                        .setUpdatedAt(date)
                        .setId(UUID.get32UUID());
                return brJourneyStage;
            }).collect(Collectors.toList());
            journeyStageService.saveBatch(brJourneyStageList);
        }
    }


    private boolean isFirstTimeLogin() {
        return sysRoleService.count() == 0;
    }


    private WxStaffResVo getStaffByExtId(String extId, boolean isLoginFromWeb) {
        if (isFirstTimeLogin()) {
            initialize(extId);
        }

        Staff staff = staffService.getOne(new QueryWrapper<Staff>().lambda().eq(Staff::getExtId, extId));
        if (staff == null) {
            return new WxStaffResVo().setStaff(null);
        }

        SysRoleStaff sysRoleStaff = sysRoleStaffService.getOne(new QueryWrapper<SysRoleStaff>().lambda()
                .eq(SysRoleStaff::getExtStaffId, staff.getExtId()).eq(SysRoleStaff::getExtCorpId, staff.getExtCorpId()));

        // hasWeb  means  login from web
        // 没有角色的员工是普通员工
        if (sysRoleStaff == null) {
            if (isLoginFromWeb) {
                throw new BaseException(CommonExceptionCode.STAFF_NO_ADMIN, "您不是管理员，无法登录后台系统！");
            } else {
                return new WxStaffResVo()
                        .setStaff(staff)
                        .setToken(staffService.change2Token(staff, false));
            }
        }

        SysRole sysRole = sysRoleService.getOne(new QueryWrapper<SysRole>().lambda().eq(SysRole::getId, sysRoleStaff.getRoleId()));
        if (sysRole != null) {
            staff.setIsAdmin(true);
            return new WxStaffResVo()
                    .setStaff(staff).setSysRole(sysRole)
                    .setToken(staffService.change2Token(staff, true));
        } else {
            if (isLoginFromWeb) {
                throw new BaseException(CommonExceptionCode.STAFF_NO_ADMIN, "您不是管理员，无法登录后台系统！");
            } else {
                return new WxStaffResVo()
                        .setStaff(staff)
                        .setToken(staffService.change2Token(staff, false));
            }
        }
    }

    @Override
    public WxStaffResVo getStaffByState(String state) {
        if (!userMap.containsKey(state)) {
            log.error("查不到该用户[{}]的信息，", state);
            return new WxStaffResVo();
        }

        String userId = userMap.get(state);
        return getStaffByExtId(userId, true);
    }

    @Override
    public WxStaffResVo getStaffByCode(String code) {

        String userId;
        try {
            WxCpOAuth2Service wxCpOAuth2Service = new WxCpOAuth2ServiceImpl(WxCpConfiguration.getWxCpService());
            WxCpOauth2UserInfo userInfo = wxCpOAuth2Service.getUserInfo(ScrmConfig.getMainAgentID(), code);
            userId = userInfo.getUserId();
        } catch (Exception e) {
            log.error("获取用户信息失败：", e);
            throw new BaseException("获取用户信息失败");
        }

        return getStaffByExtId(userId, true);
    }

    @Override
    public String getLoginUrl() {
        return String.format("https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=%s&redirect_uri=%s&state=%s&usertype=%s",
                ScrmConfig.getExtCorpID(), ScrmConfig.getLoginCallback(), UUID.get16UUID(), ScrmConfig.getLoginType());
    }

    @Override
    public WxStaffResVo loginByAuthCode(String authCode) {
        WxCpTpService tpService = new WxCpTpServiceImpl();
        tpService.setWxCpTpConfigStorage(wxCpTpConfiguration.getBaseConfig());
        WxTpLoginInfo loginInfo;
        try {
            loginInfo = tpService.getLoginInfo(authCode);
            log.info(loginInfo.getUserInfo().getName());
        } catch (WxErrorException e) {
            log.error("登录失败，", e);
            throw BaseException.buildBaseException(e.getError(), "登录失败");
        }

        //查员工信息
        Staff staff = staffService.getOne(new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, loginInfo.getCorpInfo().getCorpId())
                .eq(Staff::getExtId, loginInfo.getUserInfo().getUserId()), false);

        BrCorpAccredit corpAccredit = accreditService.getOne(new QueryWrapper<BrCorpAccredit>().lambda()
                .eq(BrCorpAccredit::getCorpId, loginInfo.getCorpInfo().getCorpId()), false);
        if (corpAccredit != null && (staff == null || staff.getId() == null)) {
            throw new BaseException(CommonExceptionCode.STAFF_NO_SEE, "您不在可见范围或没有开通席位，请联系管理员重试！");
        }
        if (staff == null || staff.getId() == null) {
            throw new BaseException(CommonExceptionCode.STAFF_NO_REGISTER, "您暂未开通系统登录权限，请联系管理员重试！");
        }
        log.info(staff.getExtCorpId());
        RBucket<List<String>> bucket = redissonClient.getBucket(Constants.CORP_ADMIN_REDIS_PRE + staff.getExtCorpId());
        List<String> adminExtIds = bucket.get();
        if (ListUtils.isEmpty(adminExtIds) || !adminExtIds.contains(staff.getExtId())) {
            throw new BaseException(CommonExceptionCode.STAFF_NO_ADMIN, "您不是管理员，无法登录后台系统！");
        }
        if (staff.getRoleId() == null) {
            return new WxStaffResVo().setStaff(staff).setToken(staffService.change2Token(staff, true));
        }
        return new WxStaffResVo()
                .setStaff(staff)
                .setToken(staffService.change2Token(staff, true));
    }


    /**
     * 自建应用根据code获取员工信息
     *
     * @param code
     * @return
     */
    @Override
    public WxStaffResVo getStaffByCodeV2(String code, boolean isLoginFromWeb) {

        String userId;
        try {
            GetUserInfoRes getUserInfoRes = cpTpFeign.getUserInfo(code, WxCpConfiguration.getWxCpService().getAccessToken());
            getUserInfoRes.checkNoZero();
            userId = getUserInfoRes.getUserid();
            tryAvatar(getUserInfoRes.getUser_ticket());
            if (StringUtils.isBlank(userId)) {
                throw new BaseException("不是企业授权人员");
            }
        } catch (Exception e) {
            log.error("获取用户信息失败：", e);
            throw new BaseException("获取用户信息失败");
        }

        return getStaffByExtId(userId, isLoginFromWeb);
    }


}
