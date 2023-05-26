package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/24 17:43
 * @description：
 **/
@Data
@ApiModel("企微应用宝统计条件")
public class WxFissionCountConditionVO {

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "id")
    @NotNull(message = "id必填！")
    private String id;

    @ApiModelProperty(value = "如果具体到某个客户，请填它的客户id")
    private String extCustomerId;

}
