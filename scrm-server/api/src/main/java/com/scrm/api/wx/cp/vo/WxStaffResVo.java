package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Role;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.entity.SysRole;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2021/12/13 0:56
 * @description：微信登录成功后查询员工信息的返回参数
 **/
@Data
@Accessors(chain = true)
@ApiModel("微信登录成功后查询员工信息的返回参数")
public class WxStaffResVo {

    @ApiModelProperty("员工信息")
    private Staff staff;

    @ApiModelProperty("角色信息")
    private SysRole sysRole;

    private String token;

    private String corpName;
}
