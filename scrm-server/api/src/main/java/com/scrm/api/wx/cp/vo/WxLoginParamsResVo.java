package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/12 0:29
 * @description：LoginParamsVO
 **/
@ApiModel("返回给前端，调微信登录url需要的参数")
@Data
public class WxLoginParamsResVo {

    private String appId;

    private Integer agentId;

    private String redirectUri;

    private String state;

    private String locationUrl;
}
