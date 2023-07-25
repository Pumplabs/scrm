package com.scrm.server.wx.cp.vo;

import cn.afterturn.easypoi.excel.annotation.Excel;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

/**
 * 客户线索
 * @author ouyang
 * @since 2023-05-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户线索")
public class BrClueExportVO {

    @Excel(name = "线索名称")
    private String name;

    @Excel(name = "客户")
    private String customer;

    @Excel(name = "手机")
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
    private Integer gender;

    @Excel(name = "来源翻译")
    private String sourceCN;

    @Excel(name = "状态", replace = {"未分配_1",  "跟进中_2","已回收_3", "已关闭_4", "已转化_5", "已退回_6"})
    private Integer status;

    @Excel(name = "描述")
    private String remark;

    @Excel(name = "创建时间", exportFormat = "yyyy-MM-dd HH:mm:ss", width = 25)
    private Date createdAt;

}
