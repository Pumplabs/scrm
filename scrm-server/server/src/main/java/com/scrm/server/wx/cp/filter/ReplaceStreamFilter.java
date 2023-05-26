package com.scrm.server.wx.cp.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/14 19:54
 * @description：filterName开头加aaa为了让这个先执行，因为过滤器是按名字排序执行的，要在参数校验前
 **/
@Slf4j
@Component
@WebFilter(urlPatterns = "/*", filterName = "aaaReqResFilter")
public class ReplaceStreamFilter implements Filter{

    @Override
    public void init(FilterConfig filterConfig) {
        log.info("ReplaceStreamFilter初始化...");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        ServletRequest requestWrapper = null;
        //获取请求中的流，将取出来的字符串，再次转换成流，然后把它放入到新request对象中,
        //xml的不要读，会出问题
        if (request instanceof HttpServletRequest
                && !Optional.ofNullable(request.getContentType()).orElse("").contains("text/xml")) {
            //这里我把body的和map的放一起了，如果后面有bug，再分开
            requestWrapper = new CorpIdRequestWrapper((HttpServletRequest) request);
        }
        // 在chain.doFiler方法中传递新的request对象
        if (requestWrapper == null) {
            chain.doFilter(request, response);
        } else {
            chain.doFilter(requestWrapper, response);
        }
    }

    @Override
    public void destroy() {
        log.info("ReplaceStreamFilter销毁...");
    }


}
