package com.scrm.server.wx.cp.vo;

import com.scrm.common.entity.SysRole;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-06-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "角色信息表结果集")
public class SysRoleVO extends SysRole{


}
