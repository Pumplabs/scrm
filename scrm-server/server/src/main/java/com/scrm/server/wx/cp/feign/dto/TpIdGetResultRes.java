package com.scrm.server.wx.cp.feign.dto;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

@Data
public class TpIdGetResultRes extends MpErrorCode{

    private Integer status;

    private String type;

    private JSONObject result;

}
