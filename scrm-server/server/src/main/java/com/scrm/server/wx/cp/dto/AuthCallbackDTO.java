package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/29 20:23
 * @description：授权回调DTO
 **/
@Data
@ApiModel("微信公众平台第三方授权回调DTO")
public class AuthCallbackDTO {

    @ApiModelProperty("回调的code")
    @NotBlank(message = "回调的code不能为空")
    private String code;

    @NotBlank(message = "缺失企业信息！")
    private String extCorpId;
}
