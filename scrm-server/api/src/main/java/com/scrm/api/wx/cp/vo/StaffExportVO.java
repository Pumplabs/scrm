package com.scrm.api.wx.cp.vo;

import cn.afterturn.easypoi.excel.annotation.Excel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;


/**
 * @Author: xxh
 * @Date: 2022/1/2 16:58
 */
@Data
@Accessors(chain = true)
public class StaffExportVO {

    @Excel(name = "员工名字", width = 25)
    private String name;

    @Excel(name = "头像地址",type = 2,height = 20)
    private String avatarUrl;

    @Excel(name = "客户数量", width = 25)
    private Integer customerCount;

    @Excel(name = "联系方式", width = 25)
    private String mobile;

    @Excel(name = "角色", width = 25)
    private String roles;

    @Excel(name = "所属部门", width = 25)
    private String departments;
}
