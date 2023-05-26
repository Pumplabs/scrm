package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author xuxh
 * @date 2022/6/7 11:26
 */
@ApiModel(value = "客户群首页统计信息请求参数")
@Data
public class WxGroupChatStatisticsDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    private Integer topNum;
}
