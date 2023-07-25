package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.scrm.server.wx.cp.config.XxlJobConfig;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.dto.XxlJobInfoDTO;
import com.scrm.server.wx.cp.dto.XxlJobQueryDto;
import com.scrm.server.wx.cp.entity.XxlJobInfo;
import com.scrm.server.wx.cp.service.IXxlJobService;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RList;
import org.redisson.api.RedissonClient;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author ouyang
 * @description xxl-job定时任务操作实现类
 * @date 2022/4/10
 **/
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class XxlJobServiceImpl implements IXxlJobService {

    private static final String LOGIN_IDENTITY_KEY = "XXL_JOB_LOGIN_IDENTITY";
    private static final String ADD_URL = "/jobinfo/add";
    private static final String UPDATE_URL = "/jobinfo/update";
    private static final String DELETE_URL = "/jobinfo/remove";
    private static final String START_URL = "/jobinfo/start";
    private static final String STOP_URL = "/jobinfo/stop";
    private static final String LIST_URL = "/jobinfo/list";
    private static final String GETGROUPID_URL = "/jobgroup/loadByName";
    private static final String LOGIN_URL = "/login";
    private static final Integer SUCCESS_CODE = 200;
    private static final String COOKIE_REDIS_KEY = "xxl-login-cookie";

    @Autowired
    XxlJobConfig xxlJobConfig;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RedissonClient redissonClient;

    @Override
    public Integer addOrUpdate(XxlJobInfoDTO dto) {
        XxlJobInfo xxlJobInfo = new XxlJobInfo();
        BeanUtils.copyProperties(dto,xxlJobInfo);

        xxlJobInfo.setJobGroup(getJobGroupId(xxlJobConfig.getAppname()));
        xxlJobInfo.setScheduleType( "CRON");
        xxlJobInfo.setScheduleConf(dto.getCron());
        xxlJobInfo.setGlueType("BEAN");
        xxlJobInfo.setMisfireStrategy("DO_NOTHING");
        xxlJobInfo.setExecutorRouteStrategy("FIRST");
        //任务阻塞策略，可选值参考 com.xxl.job.core.enums.ExecutorBlockStrategyEnum，先设置默认的，后续再修改
        xxlJobInfo.setExecutorBlockStrategy("SERIAL_EXECUTION");
        //任务超时时间，单位秒，大于零时生效
        xxlJobInfo.setExecutorTimeout(5);
        //失败重试次数
        xxlJobInfo.setExecutorFailRetryCount(0);
        xxlJobInfo.setGlueRemark("描述");
        xxlJobInfo.setExecutorParam(dto.getExecutorParam());

        Map<String, Object> map = JSON.parseObject(JSON.toJSONString(xxlJobInfo), new TypeReference<Map<String, Object>>() {
        });
        MultiValueMap<String,Object> paramMap = new LinkedMultiValueMap();
        paramMap.setAll(map);

        JSONObject result;
        if (dto.getId()!=null){
            log.info("更新xxl执行任务,请求参数:{}", xxlJobInfo);
            result = restTemplate.postForObject(xxlJobConfig.getAdminAddresses() + UPDATE_URL, setCookie(paramMap), JSONObject.class);
            checkResult(result);
            log.info("更新xxl执行任务成功,返回信息:{}", result);
            return dto.getId();
        }else {
            log.info("增加xxl执行任务,请求参数:{}", xxlJobInfo);
            result = restTemplate.postForObject(xxlJobConfig.getAdminAddresses() + ADD_URL, setCookie(paramMap), JSONObject.class);
            checkResult(result);
            log.info("增加xxl执行任务成功,返回信息:{}", result);
            return Integer.valueOf(result.getString("content"));
        }
    }

    @Override
    public void start(Integer jobId) {
        MultiValueMap<String,Object> paramMap = new LinkedMultiValueMap();
        paramMap.add("id",jobId);
        JSONObject result = restTemplate.postForObject(xxlJobConfig.getAdminAddresses() + START_URL, setCookie(paramMap), JSONObject.class);
        checkResult(result);
        log.info("启动任务成功,返回信息:{}", result);
    }

    @Override
    public void stop(Integer jobId) {
        MultiValueMap<String,Object> paramMap = new LinkedMultiValueMap();
        paramMap.add("id",jobId);
        JSONObject result = restTemplate.postForObject(xxlJobConfig.getAdminAddresses() + STOP_URL, setCookie(paramMap), JSONObject.class);
        checkResult(result);
        log.info("结束任务成功,返回信息:{}", result);
    }

    @Override
    public void delete(int jobId) {
        MultiValueMap<String,Object> paramMap = new LinkedMultiValueMap();
        paramMap.add("id",jobId);
        JSONObject result = restTemplate.postForObject(xxlJobConfig.getAdminAddresses() + DELETE_URL, setCookie(paramMap), JSONObject.class);
        checkResult(result);
        log.info("删除任务成功,返回信息:{}", result);
    }

    @Override
    public List<XxlJobInfo> getList(XxlJobQueryDto dto) {
        if (ListUtils.isNotEmpty(dto.getIds())){
            dto.setIdstr(dto.getIds().stream().map(String::valueOf).collect(Collectors.joining(",")));
            dto.setIds(null);
        }
        Map<String, Object> map = JSON.parseObject(JSON.toJSONString(dto), new TypeReference<Map<String, Object>>() {
        });
        MultiValueMap<String,Object> paramMap = new LinkedMultiValueMap();
        paramMap.setAll(map);
        JSONArray result = restTemplate.postForObject(xxlJobConfig.getAdminAddresses() + LIST_URL, setCookie(paramMap), JSONArray.class);
        List<XxlJobInfo> xxlJobInfos = JSONArray.parseArray(JSONArray.toJSONString(result), XxlJobInfo.class);
        return xxlJobInfos;
    }

    @Override
    public Integer update(XxlJobInfo xxlJobInfo) {
        Map<String, Object> map = JSON.parseObject(JSON.toJSONString(xxlJobInfo), new TypeReference<Map<String, Object>>() {
        });
        MultiValueMap<String,Object> paramMap = new LinkedMultiValueMap();
        paramMap.setAll(map);

        log.info("更新xxl执行任务,请求参数:{}", xxlJobInfo);
        JSONObject result = restTemplate.postForObject(xxlJobConfig.getAdminAddresses() + UPDATE_URL, setCookie(paramMap), JSONObject.class);
        checkResult(result);
        log.info("更新xxl执行任务成功,返回信息:{}", result);

        return xxlJobInfo.getId();
    }

    /**
     * 获取执行器id
     *
     * @return int
     */
    private int getJobGroupId(String name) {
        MultiValueMap<String,Object> paramMap = new LinkedMultiValueMap();
        paramMap.add("name",name);
        JSONObject result = restTemplate.postForObject(xxlJobConfig.getAdminAddresses() + GETGROUPID_URL, setCookie(paramMap), JSONObject.class);
        checkResult(result);
        JSONObject content = result.getJSONObject("content");
        log.info("获取执行器主键成功,返回信息:{}", result);
        return content.getInteger("id");
    }

    /**
     * 登录获取cookie
     *
     * @return String
     */
    private List<String> login() {
        String path =  xxlJobConfig.getAdminAddresses()+ LOGIN_URL;
        MultiValueMap<String,String> map = new LinkedMultiValueMap();
        map.add("userName", xxlJobConfig.getUsername());
        map.add("password", xxlJobConfig.getPassword());
        // 设置cookie永久有效，对应xxl-job记住密码
        map.add("ifRemember", "on");
        log.info("获取xxl cookie,请求参数：{}", map);
        ResponseEntity<JSONObject> responseEntity = restTemplate.postForEntity(path, map, JSONObject.class);
        checkResult(responseEntity.getBody());
        List<String> cookie = responseEntity.getHeaders().get("Set-Cookie");
        RList<String> list = redissonClient.getList(COOKIE_REDIS_KEY);
        list.addAll(cookie);

        return cookie;
    }

    /**
     * 请求异常抛出
     */
    private void checkResult(JSONObject result){
        if (result==null||result.getInteger("code")==null|| !SUCCESS_CODE.equals(result.getInteger("code"))){
            log.error("调用xxl-job接口异常,返回信息:{}",result);
//            throw new BaseException("调用xxl-job接口异常");
        }
    }

    /**
     * 请求头携带cookie
     */
    private HttpEntity setCookie(MultiValueMap<String,Object> paramMap){
        HttpHeaders headers = new HttpHeaders();
        List<String> cookie;
        RList<String> list = redissonClient.getList(COOKIE_REDIS_KEY);
        if (ListUtils.isNotEmpty(list)){
            cookie = list;
        }else {
            cookie = login();
        }
        headers.put(HttpHeaders.COOKIE,cookie);
        return new HttpEntity<>(paramMap,headers);
    }

}
