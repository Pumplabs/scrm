package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/14 17:59
 * @description：小程序的各种信息
 **/
@Data
@ApiModel("小程序的各种信息")
public class AppInfoVO {

    @ApiModelProperty("小程序名称")
    private String name;

    @ApiModelProperty("APPID")
    private String appId;

    @ApiModelProperty("APP路径")
    private String appPath;

}
