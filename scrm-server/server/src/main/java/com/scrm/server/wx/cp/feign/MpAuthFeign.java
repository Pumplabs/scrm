package com.scrm.server.wx.cp.feign;

import com.scrm.server.wx.cp.feign.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

//官方地址：https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/component_verify_ticket.html
@FeignClient(url = "https://api.weixin.qq.com", name = "mpAuthFeign")
public interface MpAuthFeign {

    /**
     * 获取令牌
     */
    @RequestMapping(value = "/cgi-bin/component/api_component_token", method = RequestMethod.POST)
    ComponentTokenRes apiComponentToken(ComponentTokenParams params);

    /**
     * 获取预授权码
     * @param params
     * @return
     */
    @RequestMapping(value = "/cgi-bin/component/api_create_preauthcode", method = RequestMethod.POST)
    PreAuthCodeRes apiCreatePreAuthCode(@RequestBody PreAuthCodeParams params,
                                        @RequestParam(name = "component_access_token") String accessToken);

    /**
     * 使用授权码获取授权信息
     * @param params
     * @param accessToken
     */
    @RequestMapping(value = "/cgi-bin/component/api_query_auth", method = RequestMethod.POST)
    QueryAuthRes apiQueryAuth(@RequestBody QueryAuthParams params, @RequestParam(name = "component_access_token") String accessToken);

    /**
     * 获取授权帐号详情
     * @param params
     * @param accessToken
     */
    @RequestMapping(value = "/cgi-bin/component/api_get_authorizer_info", method = RequestMethod.POST)
    GetAuthorizerInfoRes apiGetAuthorizerInfo(@RequestBody GetAuthorizerInfoParams params, @RequestParam(name = "component_access_token") String accessToken);

    /**
     * 通过 code 换取 access_token
     * @param appId
     * @param code
     * @param grantType
     * @param componentAppId
     * @param componentAccessToken
     * @return
     */
    @RequestMapping(value = "/sns/oauth2/component/access_token", method = RequestMethod.GET)
    String getAccessToken(@RequestParam(name = "appid") String appId,
                                     @RequestParam(name = "code") String code,
                                     @RequestParam(name = "grant_type") String grantType,
                                     @RequestParam(name = "component_appid") String componentAppId,
                                     @RequestParam(name = "component_access_token") String componentAccessToken);

    /**
     * 通过网页授权 access_token 获取用户基本信息（需授权作用域为 snsapi_userinfo）
     * @param accessToken
     * @param openId
     * @param lang
     * @return
     */
    @RequestMapping(value = "/sns/userinfo", method = RequestMethod.GET)
    String getUserInfo(@RequestParam(name = "access_token") String accessToken,
                            @RequestParam(name = "openid") String openId,
                            @RequestParam(name = "lang") String lang);
}
