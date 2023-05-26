package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
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
import com.scrm.server.wx.cp.feign.dto.GetUserInfoRes;
import com.scrm.server.wx.cp.service.*;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpOAuth2Service;
import me.chanjar.weixin.cp.api.impl.WxCpOAuth2ServiceImpl;
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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Override
    public WxLoginParamsResVo login() {
        WxLoginParamsResVo resVo = new WxLoginParamsResVo();
        resVo.setAppId(ScrmConfig.getExtCorpID());
        resVo.setAgentId(ScrmConfig.getMainAgentID());
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
            WxCpTpService wxCpTpService = new WxCpTpServiceImpl();
            wxCpTpService.setWxCpTpConfigStorage(wxCpTpConfiguration.getBaseConfig());

            WxCpTpUserDetail detail = wxCpTpService.getUserDetail3rd(userTicket);

            staffService.update(new UpdateWrapper<Staff>().lambda()
                    .set(Staff::getAvatarUrl, detail.getAvatar())
                    .eq(Staff::getExtCorpId, detail.getCorpId())
                    .eq(Staff::getExtId, detail.getUserId()));
        } catch (Exception e) {
            log.error("尝试获取头像一场，[{}],", userTicket, e);
        }
    }

    @Override
    public WxStaffResVo getCurrentStaff() {
        Staff staff = staffService.checkExists(JwtUtil.getExtUserId(), JwtUtil.getExtCorpId());
        if (staff == null) {
            return null;
        }
        WxStaffResVo result = new WxStaffResVo().setStaff(staff)
                .setCorpName(ScrmConfig.getCorpName())
                .setToken(staffService.change2Token(staff, JwtUtil.getHasWeb()));

        SysRoleStaff sysRoleStaff = sysRoleStaffService.getOne(new QueryWrapper<SysRoleStaff>().lambda()
                .eq(SysRoleStaff::getExtStaffId, staff.getExtId()).eq(SysRoleStaff::getExtCorpId, staff.getExtCorpId()));
        if (sysRoleStaff == null) {
            return result;
        }
        SysRole sysRole = sysRoleService.getOne(new QueryWrapper<SysRole>().lambda().eq(SysRole::getId, sysRoleStaff.getRoleId()));
        if (sysRole != null) {
           return result.setSysRole(sysRole);
        } else {
          return result;
        }
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

    }

    private WxStaffResVo getStaffByExtId(String extId) {
        if (sysRoleService.count() == 0) {
            initialize(extId);
        }

        Staff staff = staffService.getOne(new QueryWrapper<Staff>().lambda().eq(Staff::getExtId, extId));
        if (staff == null) {
            return new WxStaffResVo().setStaff(null);
        }

        SysRoleStaff sysRoleStaff = sysRoleStaffService.getOne(new QueryWrapper<SysRoleStaff>().lambda()
                .eq(SysRoleStaff::getExtStaffId, staff.getExtId()).eq(SysRoleStaff::getExtCorpId, staff.getExtCorpId()));
        if (sysRoleStaff == null) {
            return new WxStaffResVo()
                    .setStaff(staff)
                    .setToken(staffService.change2Token(staff, false));
        }
        SysRole sysRole = sysRoleService.getOne(new QueryWrapper<SysRole>().lambda().eq(SysRole::getId, sysRoleStaff.getRoleId()));
        if (sysRole != null) {
            staff.setIsAdmin(true);
            return new WxStaffResVo()
                    .setStaff(staff).setSysRole(sysRole)
                    .setToken(staffService.change2Token(staff, true));
        } else {
            return new WxStaffResVo()
                    .setStaff(staff)
                    .setToken(staffService.change2Token(staff, false));
        }
    }

    @Override
    public WxStaffResVo getStaffByState(String state) {
        if (!userMap.containsKey(state)) {
            log.error("查不到该用户[{}]的信息，", state);
            return new WxStaffResVo();
        }

        String userId = userMap.get(state);
        return getStaffByExtId(userId);
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

        return getStaffByExtId(userId);
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
    public WxStaffResVo getStaffByCodeV2(String code) {

        String userId;
        try {
            GetUserInfoRes getUserInfoRes = cpTpFeign.getUserInfo(code, WxCpConfiguration.getWxCpService().getAccessToken());
            getUserInfoRes.checkNoZero();
            userId = getUserInfoRes.getUserid();
            if (StringUtils.isBlank(userId)) {
                throw new BaseException("不是企业授权人员");
            }
        } catch (Exception e) {
            log.error("获取用户信息失败：", e);
            throw new BaseException("获取用户信息失败");
        }

        return getStaffByExtId(userId);
    }

}
