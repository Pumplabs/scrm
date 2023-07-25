package com.scrm.server.wx.cp.feign;

import com.scrm.server.wx.cp.feign.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(url = "${scrm.baseApiUrl}", name = "cpTpFeign")
public interface CpTpFeign {

    @RequestMapping(value = "/cgi-bin/service/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, method = RequestMethod.POST)
    TpUploadFileRes upload(@RequestPart("media") MultipartFile media,
                           @RequestParam("provider_access_token") String providerAccessToken,
                           @RequestParam("type") String type);

    @RequestMapping(value = "/cgi-bin/service/contact/id_translate", method = RequestMethod.POST)
    TpIdTranslateRes idTranslate(@RequestBody TpIdTranslateParams params,
                                 @RequestParam(name = "provider_access_token") String accessToken);

    @RequestMapping(value = "/cgi-bin/service/batch/getresult", method = RequestMethod.GET)
    TpIdGetResultRes getResult(@RequestParam(name = "provider_access_token") String accessToken,
                               @RequestParam(name = "jobid") String jobid);

    @RequestMapping(value = "/cgi-bin/user/get", method = RequestMethod.GET)
    WxCpUserRes get(@RequestParam(name = "access_token") String accessToken,
                    @RequestParam(name = "userid") String userid);

    @RequestMapping(value = "/cgi-bin/service/get_auth_info", method = RequestMethod.POST)
    GetAuthInfoRes getAuthInfo(@RequestBody GetAuthInfoParams params,
                     @RequestParam(name = "suite_access_token") String accessToken);


    @RequestMapping(value = "/cgi-bin/license/list_actived_account", method = RequestMethod.POST)
    ListActivedAccountRes listActivedAccount(@RequestBody ListActivedAccountParams params,
                                             @RequestParam(name = "provider_access_token") String accessToken);

    @RequestMapping(value = "/cgi-bin/auth/getuserinfo", method = RequestMethod.GET)
    GetUserInfoRes getUserInfo(@RequestParam(name = "code") String code, @RequestParam(name = "access_token") String accessToken);


    @RequestMapping(value = "/cgi-bin/auth/getuserdetail", method = RequestMethod.POST)
    GetUserDetailRes getUserDetail(@RequestBody String user_ticket, @RequestParam(name = "access_token") String accessToken);





}
