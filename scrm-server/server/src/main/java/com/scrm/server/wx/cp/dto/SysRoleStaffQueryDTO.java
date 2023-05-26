package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-06-16
 */
@Data
@ApiModel(value = "角色-员工关联条件查询请求参数")
@Accessors(chain = true)
public class SysRoleStaffQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("角色key 企业管理员：enterpriseAdmin")
    private String roleKey;


}
