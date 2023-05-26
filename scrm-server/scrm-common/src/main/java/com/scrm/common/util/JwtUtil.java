package com.scrm.common.util;

import com.alibaba.fastjson.JSON;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.scrm.common.constant.Constants;
import com.scrm.common.exception.BaseException;
import com.scrm.common.exception.CommonExceptionCode;
import lombok.Data;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/14 23:23
 * @description：
 **/
@Slf4j
public class JwtUtil {

    /**
     * token有效时间
     */
//    public static final long TOKEN_EXPIRE_TIME = 5 * 60 * 60 * 1000;

    public static final long TOKEN_EXPIRE_TIME = Integer.MAX_VALUE;

    private static final String TOKEN_SECRET="Ahxjmxkq89Li3Aji9M";  //密钥盐



    /**
     * 签名生成
     * @param id
     * @return
     */
    public static String sign(String id){

        try {
            String token = JWT.create()
                    .withExpiresAt(new Date(System.currentTimeMillis() + TOKEN_EXPIRE_TIME))//token有效期
                    .withSubject(id)//保存用户id
                    .sign(Algorithm.HMAC256(TOKEN_SECRET));//加密密钥
            refreshToken(token);
            return token;
        } catch (UnsupportedEncodingException e) {
            throw new BaseException(e.getMessage());
        }

    }

    /**
     * 签名验证方法,会续签过期token
     * @param token
     * @return
     */
    public static boolean verify(String token){
        //校验token格式，拿到token信息
        LoginInfo loginInfo;
        try {
            loginInfo = getLoginInfo();
            log.info("in",loginInfo);
            //校验token是否过期
            if (!checkTokenExpire(token)) {
                return false;
            }
//            //校验token的员工是否在可见范围内
//            if (!checkStaffLimit(loginInfo)) {
//                throw new BaseException(CommonExceptionCode.STAFF_NO_SEE, "您不在可见范围或没有开通席位，请联系管理员重试！");
//            }
            //校验是否是管理员
            if (checkAdmin(loginInfo)) {
                refreshToken(token);
                return true;
            }else{
                throw new BaseException(CommonExceptionCode.STAFF_NO_ADMIN, "您不是管理员，无法登录后台系统！");
            }

        }catch (Exception e){
            log.error("token校验异常，[{}]", e.getMessage());
            return false;
        }

        
    }

    private static boolean checkAdmin(LoginInfo loginInfo) {
        return !loginInfo.getHasWeb() || loginInfo.getIsAdmin();
    }

    /**
     * 检查登录员工是否在可见范围
     * @param loginInfo
     * @return
     */
    private static boolean checkStaffLimit(LoginInfo loginInfo) {
        RedissonClient redis = SpringUtils.getBeanNew(RedissonClient.class);
        RBucket<String> bucket = redis.getBucket(Constants.CORP_ACCREDIT_REDIS_PRE + loginInfo.getCorpId());

        String str = bucket.get();

        List<String> staffExtIds = JSON.parseArray(str, String.class);

        return staffExtIds.contains(loginInfo.getStaffExtId());
    }

    /**
     * 单纯签名验证，不续签
     * @param token
     * @return
     */
    public static boolean onlyVerify(String token){
        try{
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(TOKEN_SECRET)).build();
            verifier.verify(token);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    /**
     * 验证token.并且登录用户id
     */
    public static LoginInfo getLoginInfo() {
        try {
            String subject = JWT.require(Algorithm.HMAC256(TOKEN_SECRET))
                    .build()
                    .verify(RequestUtils.getToken())
                    .getSubject();

            return JSON.parseObject(subject, LoginInfo.class);
        } catch (TokenExpiredException e){
            throw new BaseException("token已失效，请重新登录");
        } catch (JWTVerificationException e) {
            throw new BaseException("token验证失败！");
        } catch (UnsupportedEncodingException e) {
            throw new BaseException("token解密失败！");
        }catch (NullPointerException e) {
            throw new BaseException("token为空！");
        }catch (RuntimeException e){
            log.error("token格式错误，", e);
            throw new BaseException("token格式错误！");
        }
    }

    /**
     * 验证token.并且登录用户id
     */
    public static String getUserId() {
        return getLoginInfo().getStaffId();
    }

    /**
     * 验证token.并且登录用户id
     */
    public static String getExtUserId() {
        return getLoginInfo().getStaffExtId();
    }

    public static Boolean getHasWeb() {
        return getLoginInfo().getHasWeb();
    }

    /**
     * 验证token.并且登录用户id
     */
    public static String getUserIdCatchError() {
        try {
            return getLoginInfo().getStaffId();
        } catch (Exception e){
            log.error("token错误，UserId为空，[{}]", e.getMessage());
            return null;
        }
    }

    /**
     * 验证token.并且登录用户id(不抛异常)
     */
    public static String getExtCorpId() {
        try {
            String subject = JWT.require(Algorithm.HMAC256(TOKEN_SECRET))
                    .build()
                    .verify(RequestUtils.getToken())
                    .getSubject();

            LoginInfo loginInfo = JSON.parseObject(subject, LoginInfo.class);
            return loginInfo.getCorpId();
        } catch (UnsupportedEncodingException| RuntimeException e){
            log.error("token错误，extCorpId置空，[{}]", e.getMessage());
            return null;
        }
    }

    /**
     * 刷新token
     * @param token
     */
    private static void refreshToken(String token){
        RedissonClient redis = SpringUtils.getBeanNew(RedissonClient.class);
        redis.getBucket(token).set(true, 3, TimeUnit.HOURS);
    }

    /**
     * 检查token是否过期
     * @param token
     */
    private static boolean checkTokenExpire(String token){
        RedissonClient redis = SpringUtils.getBeanNew(RedissonClient.class);
        RBucket<Object> bucket = redis.getBucket(token);
        if (bucket == null || bucket.get() == null) {
            return false;
        }
        return true;
    }

   

    @Data
    @Accessors(chain = true)
    public static class LoginInfo{

        private String staffId;

        private String staffExtId;

        private String corpId;
        
        private Boolean hasWeb;
        
        private Boolean isAdmin;

    }
}
