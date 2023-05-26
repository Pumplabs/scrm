package com.scrm.server.wx.cp.feign.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/23 11:53
 * @description：
 **/
@Data
public class Privilege {

    @SerializedName("level")
    private Integer level;
    @SerializedName("allow_party")
    private List<Integer> allow_party;
    @SerializedName("allow_user")
    private List<String> allow_user;
    @SerializedName("allow_tag")
    private List<Integer> allow_tag;
    @SerializedName("extra_party")
    private List<Integer> extra_party;
    @SerializedName("extra_user")
    private List<String> extra_user;
    @SerializedName("extra_tag")
    private List<Integer> extra_tag;

}
