package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-03-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户查看素材的动态新增DTO")
public class WxDynamicMediaSaveDTO {

    @ApiModelProperty(value = "企业id")
    @NotNull(message = "企业id必填")
    private String corpId;

    @ApiModelProperty(value = "客户Id")
    @NotNull(message = "客户Id必填")
    private String customerExtId;

    @ApiModelProperty(value = "轨迹素材id")
    @NotNull(message = "素材选择必填")
    private String mediaInfoId;

    @ApiModelProperty("员工的extId")
    @NotNull(message = "员工的信息必填")
    private String extStaffId;
}
