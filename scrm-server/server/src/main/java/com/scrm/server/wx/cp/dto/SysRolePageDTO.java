package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-06-16
 */
@Data
@ApiModel(value = "角色信息表分页请求参数")
@Accessors(chain = true)
public class SysRolePageDTO extends BasePageDTO{


}

