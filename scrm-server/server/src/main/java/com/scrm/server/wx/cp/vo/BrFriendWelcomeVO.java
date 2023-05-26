package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Department;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrFriendWelcome;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * @author xxh
 * @since 2022-04-23
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "好友欢迎语结果集")
public class BrFriendWelcomeVO extends BrFriendWelcome{


    @ApiModelProperty(value = "创建员工信息")
    private Staff creatorStaff;

    @ApiModelProperty(value = "员工列表")
    private List<Staff> staffList;

    @ApiModelProperty(value = "部门列表")
    private List<Department> departmentList;

}
