package com.scrm.server.wx.cp.vo;

import cn.afterturn.easypoi.excel.annotation.Excel;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

/**
 * 客户线索
 * @author ouyang
 * @since 2023-05-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户线索")
public class BrClueImportVO extends ExcelVerifyInfo {

    @Excel(name = "线索名称")
    @Length(max = 20, message = "不能超过20字")
    private String name;

    @Excel(name = "客户")
    @Length(max = 20, message = "不能超过20字")
    @NotBlank(message = "不能为空")
    private String customer;

    @Excel(name = "手机")
    @NotBlank(message = "不能为空")
    private String phone;

    @Excel(name = "qq")
    private String qq;

    @Excel(name = "邮箱")
    private String email;

    @Excel(name = "公司")
    private String company;

    @Excel(name = "职位")
    private String position;

    @Excel(name = "性别", replace = {"未知_0", "男_1", "女_2"})
    @Pattern(regexp = "[012]", message = "错误")
    private String gender;

    @Excel(name = "来源")
    @NotBlank(message = "不能为空")
    private String source;

    @Excel(name = "描述")
    @Length(max = 200, message = "不能超过200字")
    private String remark;

}
