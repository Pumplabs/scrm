package com.scrm.common.config;

import com.scrm.common.exception.BaseException;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * 读取项目相关配置
 *
 * @author xuxh
 */
@Data
@Component
@ConfigurationProperties(prefix = "scrm")
public class ScrmConfig {
    /**
     * 项目名称
     */
    private String name;

    /**
     * 版本
     */
    private String version;

    /**
     * 版权年份
     */
    private String copyrightYear;

    /**
     * 实例演示开关
     */
    private boolean demoEnabled;

    /**
     * 获取地址开关
     */
    private static boolean addressEnabled;

    /**
     * 企业ID
     */
    private static String extCorpID;

    private static String corpName;

    private static String baseApiUrl;

    public static String getBaseApiUrl() {
        return baseApiUrl;
    }

    public  void setBaseApiUrl(String baseApiUrl) {
        this.baseApiUrl = baseApiUrl;
    }

    public static String getCorpName() {
        return corpName;
    }

    public void setCorpName(String corpName) {
        this.corpName = corpName;
    }

    /**
     * 企业微信通讯录API
     */
    private static String contactSecret;

    /**
     * 企业微信客户联系API
     */
    private static String customerSecret;

    /**
     * 企业自建主应用ID
     */
    private static String mainAgentID;

    /**
     * 企业自建主应用Secret
     */
    private static String mainAgentSecret;

    /**
     * 会话存档
     */
    private static String msgAuditSecret;

    /**
     * 短的回调地址的token
     */
    private static String shortCallbackToken;

    /**
     * 客户联系的回调AESKey
     */
    private static String customerAesKey;

    /**
     * 同步通讯录回调地址的token
     */
    private static String callbackToken;

    /**
     * 同步通讯录回调地址的AesKey
     */
    private static String callbackAesKey;

    /**
     * 会话存档服务私钥
     */
    private static String priKeyPath;

    /**
     * 系统域名
     */
    private static String domainName;

    /**
     * 客户详情url
     */
    private static String customerDetailUrl;

    /**
     * 群欢迎语url
     */
    private static String groupChatWelcomeUrl;

    /**
     * 轨迹素材url
     */
    private static String mediaInfoUrl;

    /**
     * 登录时的回调地址
     */
    private static String loginRedirectUrl;

    /**
     * 企微应用宝，参与活动地址
     */
    private static String fissionEventUrl;

    /**
     * 销售日报路径
     */
    private static String saleReportUrl;

    /**
     * windows文件上传路径
     */
    private static String windowsFilePath;

    /**
     * 文件下载地址
     */
    private static String downloadUrl;

    /**
     * 微信开放平台的appId
     */
    private static String mpAppId;

    /**
     * 微信开放平台的密钥
     */
    private static String mpAppSecret;

    /**
     * 微信开放平台的token
     */
    private static String mpAppToken;

    /**
     * 微信开放平台的AesKey
     */
    private static String mpAppAesKey;

    /**
     * linux文件上传路径
     */
    private static String linuxFilePath;

    /**
     * 主第三方应用id
     */
    private static String mainSuiteID;

    /**
     * 主第三方应用密钥
     */
    private static String mainSuiteSecret;

    /**
     * 主第三方应用回调用的token
     */
    private static String mainSuiteToken;

    /**
     * 主第三方应用回调用的aseKey
     */
    private static String mainSuiteEncodingAESKey;

    /**
     * 服务商secret
     */
    private static String providerSecret;

    /**
     * 临时授权回调
     */
    private static String tempAuthCallbackUrl;

    /**
     * 登录回调
     */
    private static String loginCallback;

    /**
     * 登录方式
     */
    private static String loginType;

    /**
     * 跟进的地址
     */
    private static String followDetailUrl;

    /**
     * 试用版本id
     */
    private static String trialVersionId;

    /**
     * 试用天数
     */
    private static String trialTime;

    /**
     * 是否是试用的
     */
    private static String hasTest;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public static String getProfile() {
        return File.separator.equals("/") ? linuxFilePath : windowsFilePath;
    }

    public void setWindowsFilePath(String windowsFilePath) {
        ScrmConfig.windowsFilePath = windowsFilePath;
    }

    public void setLinuxFilePath(String linuxFilePath) {
        ScrmConfig.linuxFilePath = linuxFilePath;
    }

    public static String getDownloadUrl() {
        return domainName + downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        ScrmConfig.downloadUrl = downloadUrl;
    }


    public static String getExtCorpID() {
        return extCorpID;
    }

    public void setExtCorpID(String extCorpID) {
        ScrmConfig.extCorpID = extCorpID;
    }

    public static String getContactSecret() {
        return contactSecret;
    }

    public void setContactSecret(String contactSecret) {
        ScrmConfig.contactSecret = contactSecret;
    }

    public static String getCustomerSecret() {
        return customerSecret;
    }

    public void setCustomerSecret(String customerSecret) {
        ScrmConfig.customerSecret = customerSecret;
    }

    public static Integer getMainAgentID() {
        return Integer.valueOf(mainAgentID);
    }

    public void setMainAgentID(String mainAgentID) {
        ScrmConfig.mainAgentID = mainAgentID;
    }

    public static String getMainAgentSecret() {
        return mainAgentSecret;
    }

    public void setMainAgentSecret(String mainAgentSecret) {
        ScrmConfig.mainAgentSecret = mainAgentSecret;
    }

    public static String getCustomerAesKey() {
        return customerAesKey;
    }

    public void setCustomerAesKey(String customerAesKey) {
        ScrmConfig.customerAesKey = customerAesKey;
    }

    public static String getShortCallbackToken() {
        return shortCallbackToken;
    }

    public void setShortCallbackToken(String shortCallbackToken) {
        ScrmConfig.shortCallbackToken = shortCallbackToken;
    }

    public static String getCallbackToken() {
        return callbackToken;
    }

    public void setCallbackToken(String callbackToken) {
        ScrmConfig.callbackToken = callbackToken;
    }

    public static String getCallbackAesKey() {
        return callbackAesKey;
    }

    public void setCallbackAesKey(String callbackAesKey) {
        ScrmConfig.callbackAesKey = callbackAesKey;
    }

    public static String getPriKeyPath() {
        return priKeyPath;
    }

    public void setPriKeyPath(String priKeyPath) {
        ScrmConfig.priKeyPath = priKeyPath;
    }

    public static String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        ScrmConfig.domainName = domainName;
    }

    public static String getCustomerDetailUrl() {
        return domainName + customerDetailUrl;
    }

    public void setCustomerDetailUrl(String customerDetailUrl) {
        ScrmConfig.customerDetailUrl = customerDetailUrl;
    }

    public static String getGroupChatWelcomeUrl() {
        return domainName + groupChatWelcomeUrl;
    }

    public void setGroupChatWelcomeUrl(String groupChatWelcomeUrl) {
        ScrmConfig.groupChatWelcomeUrl = groupChatWelcomeUrl;
    }

    public static String getMediaInfoUrl() {
        return domainName + mediaInfoUrl;
    }

    public void setMediaInfoUrl(String mediaInfoUrl) {
        ScrmConfig.mediaInfoUrl = mediaInfoUrl;
    }

    public static String getLoginRedirectUrl() {
        return loginRedirectUrl;
    }

    public void setLoginRedirectUrl(String loginRedirectUrl) {
        ScrmConfig.loginRedirectUrl = loginRedirectUrl;
    }

    public static String getFissionEventUrl() {
        return domainName + fissionEventUrl;
    }

    public void setFissionEventUrl(String fissionEventUrl) {
        ScrmConfig.fissionEventUrl = fissionEventUrl;
    }

    public static String getSaleReportUrl() {
        return domainName + saleReportUrl;
    }

    public void setSaleReportUrl(String saleReportUrl) {
        ScrmConfig.saleReportUrl = saleReportUrl;
    }

    public static String getMpAppId() {
        return mpAppId;
    }

    public void setMpAppId(String mpAppId) {
        ScrmConfig.mpAppId = mpAppId;
    }

    public static String getMpAppSecret() {
        return mpAppSecret;
    }

    public void setMpAppSecret(String mpAppSecret) {
        ScrmConfig.mpAppSecret = mpAppSecret;
    }

    public static String getMpAppToken() {
        return mpAppToken;
    }

    public void setMpAppToken(String mpAppToken) {
        ScrmConfig.mpAppToken = mpAppToken;
    }

    public static String getMpAppAesKey() {
        return mpAppAesKey;
    }

    public void setMpAppAesKey(String mpAppAesKey) {
        ScrmConfig.mpAppAesKey = mpAppAesKey;
    }

    public static String getMainSuiteID() {
        return mainSuiteID;
    }

    public void setMainSuiteID(String mainSuiteID) {
        ScrmConfig.mainSuiteID = mainSuiteID;
    }

    public static String getMainSuiteSecret() {
        return mainSuiteSecret;
    }

    public void setMainSuiteSecret(String mainSuiteSecret) {
        ScrmConfig.mainSuiteSecret = mainSuiteSecret;
    }

    public static String getMainSuiteToken() {
        return mainSuiteToken;
    }

    public void setMainSuiteToken(String mainSuiteToken) {
        ScrmConfig.mainSuiteToken = mainSuiteToken;
    }

    public static String getMainSuiteEncodingAESKey() {
        return mainSuiteEncodingAESKey;
    }

    public void setMainSuiteEncodingAESKey(String mainSuiteEncodingAESKey) {
        ScrmConfig.mainSuiteEncodingAESKey = mainSuiteEncodingAESKey;
    }

    public static String getProviderSecret() {
        return providerSecret;
    }

    public void setProviderSecret(String providerSecret) {
        ScrmConfig.providerSecret = providerSecret;
    }

    public static String getTempAuthCallbackUrl() {
        return domainName + tempAuthCallbackUrl;
    }

    public void setTempAuthCallbackUrl(String tempAuthCallbackUrl) {
        ScrmConfig.tempAuthCallbackUrl = tempAuthCallbackUrl;
    }

    public static String getLoginCallback() {
        return domainName + loginCallback;
    }

    public void setLoginCallback(String loginCallback) {
        ScrmConfig.loginCallback = loginCallback;
    }

    public static String getLoginType() {
        return loginType;
    }

    public void setLoginType(String loginType) {
        ScrmConfig.loginType = loginType;
    }

    public static String getFollowDetailUrl() {
        return domainName + followDetailUrl;
    }

    public void setFollowDetailUrl(String followDetailUrl) {
        ScrmConfig.followDetailUrl = followDetailUrl;
    }

    public static String getTrialVersionId() {
        return trialVersionId;
    }

    public void setTrialVersionId(String trialVersionId) {
        ScrmConfig.trialVersionId = trialVersionId;
    }

    public static String getTrialTime() {
        return trialTime;
    }

    public void setTrialTime(String trialTime) {
        ScrmConfig.trialTime = trialTime;
    }

    public static String getHasTest() {
        return hasTest;
    }

    public void setHasTest(String hasTest) {
        ScrmConfig.hasTest = hasTest;
    }

    public static String getMsgAuditSecret() {
        return msgAuditSecret;
    }

    public void setMsgAuditSecret(String msgAuditSecret) {
        ScrmConfig.msgAuditSecret = msgAuditSecret;
    }

    /**
     * 获取导入上传路径
     */
    public static String getImportPath() {
        return getProfile() + "/import/";
    }


    /**
     * 获取下载路径
     */
    public static String getDownloadPath() {
        return getProfile() + "/download/";
    }

    /**
     * 获取上传路径
     */
    public static String getUploadPath() {
        String path = getProfile() + "upload" + File.separator;
        File folder = new File(path);
        if (!folder.exists() && !folder.mkdirs()) {
            throw new BaseException("创建文件夹失败！");
        }
        return path;
    }
}
