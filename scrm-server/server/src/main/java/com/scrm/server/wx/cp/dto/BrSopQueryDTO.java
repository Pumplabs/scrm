package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@ApiModel(value = "sop条件查询请求参数")
@Accessors(chain = true)
public class BrSopQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "状态 1:已启用 0:已禁用")
    private Integer status;

    @ApiModelProperty(value = "触发条件 1:时间 2:添加好友 3:创建群聊")
    private Integer term;

}
