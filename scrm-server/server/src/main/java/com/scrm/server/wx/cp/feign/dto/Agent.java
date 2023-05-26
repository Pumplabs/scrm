package com.scrm.server.wx.cp.feign.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/23 11:33
 * @description：
 **/
@Data
public class Agent {

    @SerializedName("agentid")
    private Integer agentid;
    @SerializedName("name")
    private String name;
    @SerializedName("round_logo_url")
    private String round_logo_url;
    @SerializedName("square_logo_url")
    private String square_logo_url;
    /** @deprecated */
    @SerializedName("appid")
    @Deprecated
    private String appid;
    @SerializedName("auth_mode")
    private Integer auth_mode;
    @SerializedName("is_customized_app")
    private Boolean is_customized_app;
    @SerializedName("privilege")
    private Privilege privilege;
    @SerializedName("edition_id")
    private String edition_id;
    @SerializedName("edition_name")
    private String edition_name;
    @SerializedName("app_status")
    private Integer app_status;
    @SerializedName("user_limit")
    private Integer user_limit;
    @SerializedName("expired_time")
    private Long expired_time;
    @SerializedName("is_virtual_version")
    private Boolean is_virtual_version;
    @SerializedName("is_shared_from_other_corp")
    private Boolean is_shared_from_other_corp;
}
