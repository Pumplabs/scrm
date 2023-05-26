package com.scrm.server.wx.cp.filter;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.scrm.common.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static com.scrm.common.constant.Constants.CORP_PARAM_NAME;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/14 22:56
 * @description：通用的给所有请求加上extCorp参数
 **/
@Slf4j
public class CorpIdRequestWrapper extends HttpServletRequestWrapper {

    /**
     * json也转成map放里面了，如果分开，单json不需要用map装参数
     */
    private Map<String, Object> params = new HashMap<>();

    public CorpIdRequestWrapper(HttpServletRequest request) {
        super(request);

        //如果是普通参数
        this.params.putAll(Optional.ofNullable(request.getParameterMap()).orElse(new HashMap<>()));

        //如果是body
        Body2Map(request);

        //put一个extCorpId进去
        String extCorpId = JwtUtil.getExtCorpId();

        log.info("[{}]是[{}]", CORP_PARAM_NAME, extCorpId);
        addParameter(CORP_PARAM_NAME, extCorpId);

    }

    private void addParameter(String name, Object value) {
        if (value != null) {
            params.put(name, value);
        }
    }


    /**
     * 获取请求Body,转成map,写入
     *
     * @param request request
     * @return String
     */
    public void Body2Map(final ServletRequest request) {
        try {
            inputStream2Map(request.getInputStream());
        } catch (IOException e) {
            log.error("", e);
            throw new RuntimeException(e);
        }
    }

    /**
     * 将inputStream里的数据读取出来并写入字符串
     *
     * @param inputStream inputStream
     * @return String
     */
    private void inputStream2Map(InputStream inputStream) {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            log.error("", e);
            throw new RuntimeException(e);
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    log.error("", e);
                }
            }
        }

        //写进map，如果单纯json，不用写进map，直接存一个byte[]
        try {
            JSONObject obj = JSONObject.parseObject(sb.toString());
            if (obj != null) {
                obj.forEach(this::addParameter);
            }
        }catch (JSONException e){
            log.error("corpId拦截器写json失败，不写json了..");
        }

    }

    /**
     * 把map转成json
     * @return
     */
    private String change2Json(){
        JSONObject json = new JSONObject();
        params.forEach(json::put);
        return json.toJSONString();
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(getInputStream()));
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {

        final ByteArrayInputStream inputStream = new ByteArrayInputStream(change2Json().getBytes(StandardCharsets.UTF_8));

        return new ServletInputStream() {
            @Override
            public int read() throws IOException {
                return inputStream.read();
            }

            @Override
            public boolean isFinished() {
                return false;
            }

            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setReadListener(ReadListener readListener) {
            }
        };
    }

    @Override
    public Enumeration<String> getParameterNames() {
        return Collections.enumeration(params.keySet());
    }

    @Override
    public String getParameter(String name) {
        Object o = params.get(name);
        if (o == null) {
            return null;
        }
        return o.toString();

    }

    @Override
    public String[] getParameterValues(String name) {
        return changeToArray(params.get(name));
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        Map<String, String[]> result = new HashMap<>();
        this.params.forEach((k, v) -> result.put(k, changeToArray(v)));
        return result;
    }

    private String[] changeToArray(Object value){
        if (value == null) {
            return null;
        }
        if (value instanceof String[]) {
            return  (String[]) value;
        } else if (value instanceof String) {
            return new String[]{(String) value};
        } else {
            return new String[]{JSONObject.toJSONString(value)};
        }
    }
}
