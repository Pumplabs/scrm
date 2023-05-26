package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.common.entity.SysRoleStaff;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-06-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "角色-员工关联结果集")
public class SysRoleStaffVO extends SysRoleStaff{

    @ApiModelProperty(value = "创建者信息")
    private StaffVO creatorStaff;

    @ApiModelProperty(value = "员工")
    private StaffVO staff;

}
