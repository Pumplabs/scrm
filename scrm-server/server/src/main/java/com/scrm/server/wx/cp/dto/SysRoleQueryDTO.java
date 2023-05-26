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
@ApiModel(value = "角色信息表条件查询请求参数")
@Accessors(chain = true)
public class SysRoleQueryDTO {


}
