package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Department;
import com.scrm.api.wx.cp.entity.Staff;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * @author xxh
 * @since 2021-12-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "员工结果集")
public class StaffVO extends Staff{

    @ApiModelProperty(value = "所属部门列表")
   private List<Department> departmentList;
}
