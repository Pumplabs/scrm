package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-08-02
 */
@Data
@ApiModel(value = "客户-员工跟进协助人条件查询请求参数")
@Accessors(chain = true)
public class WxCustomerStaffAssistQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "员工extId")
    private String extStaffId;

    @ApiModelProperty(value = "客户extId")
    private String extCustomerId;

}
