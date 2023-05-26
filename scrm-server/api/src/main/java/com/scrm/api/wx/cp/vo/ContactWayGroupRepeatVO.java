package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/27 21:00
 * @description：渠道活码分组测重名VO
 **/
@Data
@ApiModel("渠道活码分组测重名VO")
public class ContactWayGroupRepeatVO {

    @ApiModelProperty(value = "'ID'")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    @NotNull(message = "创建者外部员工ID不能为空")
    private String extCreatorId;

    @ApiModelProperty(value = "'分组名称'")
    @NotNull(message = "分组名称不能为空")
    private String name;
}
