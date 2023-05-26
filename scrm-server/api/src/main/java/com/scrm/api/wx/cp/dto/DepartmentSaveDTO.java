package com.scrm.api.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;


@Data
@Accessors(chain = true)
@ApiModel(value = "企业部门新增DTO")
public class DepartmentSaveDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "部门名称", required = true)
    @NotBlank(message = "部门名称不能为空")
    private String name;

    @ApiModelProperty(value = "上级部门ID,根部门为1", required = true)
    @NotNull(message = "上级部门不能为空")
    private Long extParentId;

    @ApiModelProperty(value = "在父部门中的次序值")
    private Long order;

    @ApiModelProperty(value = "部门使用的欢迎语")
    private String welcomeMsgId;

    @ApiModelProperty(value = "是否需要同步到企业微信(用于事件同步)", hidden = true)
    private boolean needSynToWx = true;

    @ApiModelProperty(value = "新增时间(用于事件同步)", hidden = true)
    private Date createTime;

    @ApiModelProperty(value = "是否需要同步到企业微信(用于事件同步)", hidden = true)
    private Long extId;


}
