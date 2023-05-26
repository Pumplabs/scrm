package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/2/21 17:55
 * @description：客户群发，提醒参数
 **/
@Data
@ApiModel("客户群发，提醒参数")
public class WxMsgTemplateRemindDTO {

    @NotNull(message = "请选择企业")
    @ApiModelProperty("你懂的")
    private String extCorpId;

    @ApiModelProperty("群发id")
    @NotNull(message = "请选择群发")
    private String templateId;

    @ApiModelProperty("员工id，填了员工id也需要填群发id")
    private String staffExtId;


}
