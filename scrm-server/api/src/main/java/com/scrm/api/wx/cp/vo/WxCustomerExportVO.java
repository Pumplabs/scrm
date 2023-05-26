package com.scrm.api.wx.cp.vo;

import cn.afterturn.easypoi.excel.annotation.Excel;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @Author: xxh
 * @Date: 2022/1/2 16:27
 */
@Data
@Accessors(chain = true)
public class WxCustomerExportVO {

    @Excel(name = "客户名称", width = 25)
    private String name;

    @Excel(name = "客户头像", type = 2, height = 20)
    private String avatar;

    @Excel(name = "所属员工", width = 25)
    private String extCreatorName;

    @Excel(name = "性别", replace = {"未知_0", "男性_1", "女性_2"}, width = 25)
    private Integer gender;

    @Excel(name = "类型", replace = {"微信用户_1", "企业微信用户_2"}, width = 25)
    private Integer type;

    @Excel(name = "描述", width = 25)
    private String description;

    @Excel(name = "电话", width = 25)
    private String phoneNumber;

    @Excel(name = "年龄", width = 25)
    private Integer age;

    @Excel(name = "邮箱", width = 25)
    private String email;


}
