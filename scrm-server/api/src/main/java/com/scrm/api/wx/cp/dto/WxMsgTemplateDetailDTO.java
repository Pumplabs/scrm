package com.scrm.api.wx.cp.dto;

import com.scrm.api.wx.cp.entity.WxMsgTemplateDetail;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/2/20 0:20
 * @description：客户群发，客户发送情况结果
 **/
@Data
@ApiModel("客户群发，客户发送情况结果")
public class WxMsgTemplateDetailDTO extends WxMsgTemplateDetail {

    @ApiModelProperty("员工名字")
    private String staffName;

    @ApiModelProperty("客户名")
    private String customerName;

    @ApiModelProperty("客户头像地址")
    private String customerAvatarUrl;
    
    @ApiModelProperty("客户的公司名称,仅当客户ID为企业微信ID时存在")
    private String corpName;
}
