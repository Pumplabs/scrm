package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author xuxh
 * @date 2022/7/7 19:08
 */
@Data
@ApiModel(value = "企业微信客户今日统计DTO")
public class WxCustomerTodayStatisticsDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "是否查询权限数据：false:否 true:是")
    private Boolean isPermission;


}
