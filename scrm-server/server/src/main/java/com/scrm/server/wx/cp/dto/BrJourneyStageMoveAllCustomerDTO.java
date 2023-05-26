package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author xuxh
 * @date 2022/4/11 17:06
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "移到阶段的所有客户请求参数")
public class BrJourneyStageMoveAllCustomerDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "源阶段id",required = true)
    @NotBlank(message = "源不能为空")
    private String sourceId;

    @ApiModelProperty(value = "目标阶段id",required = true)
    @NotBlank(message = "目标不能为空")
    private String targetId;


}
