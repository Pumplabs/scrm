package com.scrm.server.wx.cp.feign.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/23 11:31
 * @description：
 **/
@Data
public class AuthInfo {

    @SerializedName("agent")
    private List<Agent> agent;
}
