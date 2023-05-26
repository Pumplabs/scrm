package com.scrm.common.util;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/15 0:45
 * @description：
 **/
public class RequestUtils {

    private  static final String TOKEN_KEY = "token";

    public static HttpServletRequest getRequest(){
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
    }

    public static String getToken(){
        // 从请求头中取出加密token
        String token = getRequest().getHeader(TOKEN_KEY);
        if (StringUtils.isBlank(token)) {
            token = getRequest().getParameter("TOKEN_KEY");
        }
        return token;
    }
}
