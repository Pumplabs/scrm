package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Department;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2021-12-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "结果集")
public class DepartmentVO extends Department{


}
