package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/1 16:40
 * @description：微信公众号appId
 **/
@Data
@Accessors(chain = true)
@ApiModel("微信公众号appId")
public class MpAppIdDTO {

    @ApiModelProperty("mpAppId")
    private String mpAppId;

    @ApiModelProperty("componentAppId")
    private String componentAppId;
}
