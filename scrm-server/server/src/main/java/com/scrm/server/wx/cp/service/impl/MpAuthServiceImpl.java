package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.exception.BaseException;
import com.scrm.server.wx.cp.service.IMpAuthService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/15 20:23
 * @description：微信公众号授权接口
 **/
@Slf4j
@Service
public class MpAuthServiceImpl implements IMpAuthService {

    @Autowired
    private IWxCustomerService customerService;

    @Override
    public String getUnionIdByCode(String code, String extCorpId) {
//        HttpsUtils.getTrust();
        //拿accessCode和openId
        String getAccessCodeUrl = String.format(
                "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code",
                ScrmConfig.getMpAppId(), ScrmConfig.getMpAppSecret(), code
        );
        JSONObject accessCodeRes = sendMpRequest(getAccessCodeUrl);

        //拿用户信息
        String getUnionIdUrl = String.format("" +
                        "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN",
                accessCodeRes.getString("access_token"), accessCodeRes.getString("openid"));
        JSONObject unionIdRes = sendMpRequest(getUnionIdUrl);

        return unionIdRes.getString("unionid");
    }

    @Override
    public String getAppIdIdByCorpId(String extCorpId) {
        return ScrmConfig.getMpAppId();
    }

    @Override
    public WxCustomer getCustomerByCode(String code, String extCorpId) {
        String unionId = getUnionIdByCode(code, extCorpId);
        return customerService.getOne(new QueryWrapper<WxCustomer>().lambda()
                .eq(WxCustomer::getExtCorpId, extCorpId)
                .eq(WxCustomer::getUnionid, unionId), false);
    }

    private JSONObject sendMpRequest(String url) {
        //初始化链接
        HttpsURLConnection connection;
        try {
            connection = (HttpsURLConnection) new URL(url).openConnection();

            // 设置通用的请求属性
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            // 设置链接主机超时时间
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(90000);

            // 建立实际的连接
            connection.connect();
        }catch (IOException e){
            log.error("请求微信公众号接口出错,[{}]:", url, e);
            throw new BaseException("请求微信公众号接口出错！");
        }

        //请求公众号后台
        StringBuilder result = new StringBuilder();
        try (
                // 定义 BufferedReader输入流来读取URL的响应
                Reader reader = new InputStreamReader(connection.getInputStream());
                BufferedReader in = new BufferedReader(reader)
        ){

            String line;
            while ((line = in.readLine()) != null) {
                result.append(line);
            }
        }catch (Exception e){
            log.error("请求微信公众号接口出错,[{}]:", url, e);
            throw new BaseException("请求微信公众号接口出错！");
        }

        //解析结果
        JSONObject json = JSONObject.parseObject(result.toString());

        if (json.containsKey("errcode")) {
            log.error("请求微信公众号接口出错，[{}], [{}]", url, result.toString());
            throw new BaseException("请求微信公众号接口出错！");
        }

        return json;
    }
}
