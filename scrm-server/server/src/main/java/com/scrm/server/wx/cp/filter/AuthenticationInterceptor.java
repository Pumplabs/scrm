package com.scrm.server.wx.cp.filter;

import com.alibaba.fastjson.JSON;
import com.scrm.common.annotation.PassToken;
import com.scrm.common.constant.Constants;
import com.scrm.common.constant.R;
import com.scrm.common.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/14 23:57
 * @description：
 **/
@Slf4j
public class AuthenticationInterceptor implements HandlerInterceptor {

    /**
     * 拦截器不拦截的路径，doc，swagger，文件上传的路径，
     * 在webapps用excludePathPatterns不生效，有bug，因为这些路径不存在，自动映射到/error.html
     */
    List<String> excludePaths = Arrays.asList("/api-docs", "/swagger-ui/","/druid/", Constants.RESOURCE_PREFIX + "/");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object object) throws Exception {
        String token = request.getHeader("token");// 从 http 请求头中取出 token
        // 如果不是映射到方法直接通过
        if(!(object instanceof HandlerMethod)){
            return true;
        }
        //在拦截路径外的，直接过
        if (excludePaths.stream().anyMatch(e -> request.getRequestURI().contains(e))) {
            return true;
        }
        HandlerMethod handlerMethod=(HandlerMethod)object;
        Method method = handlerMethod.getMethod();
        //检查是否有passtoken注释，有则跳过认证
        if (method.isAnnotationPresent(PassToken.class)) {
            PassToken passToken = method.getAnnotation(PassToken.class);
            return true;
        }
        if(token != null){
            boolean result = JwtUtil.verify(token);
            if(result){
                return true;
            }
        }
        //校验不通过
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response401(response);
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }
    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }

    /**
     * 无需转发，直接返回Response信息
     */
    private void response401(ServletResponse resp) {
        HttpServletResponse httpServletResponse = (HttpServletResponse) resp;
        httpServletResponse.setStatus(401);
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("application/json; charset=utf-8");
        PrintWriter out = null;
        try {
            out = httpServletResponse.getWriter();
            String data = JSON.toJSONString(R.fail("认证失败"));
            out.append(data);
        } catch (IOException e) {
            log.error(e.getMessage());
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }
}
