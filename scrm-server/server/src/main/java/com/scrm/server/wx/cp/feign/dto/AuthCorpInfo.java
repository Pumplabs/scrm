package com.scrm.server.wx.cp.feign.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/23 11:31
 * @description：
 **/
@Data
public class AuthCorpInfo {

    @SerializedName("corpid")
    private String corpid;
    @SerializedName("corp_name")
    private String corp_name;
    @SerializedName("corp_type")
    private String corp_type;
    @SerializedName("corp_square_logo_url")
    private String corp_square_logo_url;
    @SerializedName("corp_round_logo_url")
    private String corp_round_logo_url;
    @SerializedName("corp_user_max")
    private String corp_user_max;
    @SerializedName("corp_agent_max")
    private String corp_agent_max;
    @SerializedName("corp_full_name")
    private String corp_full_name;
    @SerializedName("verified_end_time")
    private Long verified_end_time;
    @SerializedName("subject_type")
    private Integer subject_type;
    @SerializedName("corp_wxqrcode")
    private String corp_wxqrcode;
    @SerializedName("corp_scale")
    private String corp_scale;
    @SerializedName("corp_industry")
    private String corp_industry;
    @SerializedName("corp_sub_industry")
    private String corp_sub_industry;
    @SerializedName("location")
    private String location;
}
