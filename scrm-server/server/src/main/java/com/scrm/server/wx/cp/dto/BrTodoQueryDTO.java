package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-05-20
 */
@Data
@ApiModel(value = "待办条件查询请求参数")
@Accessors(chain = true)
public class BrTodoQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "状态 1:已完成 0:未完成 2:已逾期")
    private Integer status;

    @ApiModelProperty(value = "关联业务id")
    private String businessId;

    @ApiModelProperty(value = "关联业务id1")
    private String businessId1;

    @ApiModelProperty(value = "待办类型 1:sop 2:群sop 3:跟进")
    private Integer type;

    @ApiModelProperty(value = "所属人id")
    private String ownerExtId;

    private String createTime;

}
