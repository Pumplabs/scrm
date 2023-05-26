package com.scrm.api.wx.cp.dto;

import cn.afterturn.easypoi.excel.annotation.Excel;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;


@Data
@ApiModel("渠道码根据客户统计导出DTO")
@Accessors(chain = true)
public class ContactWayCountCustomerExportDTO {

    @Excel(name = "客户名称")
    private String customerName;

    @Excel(name = "添加员工")
    private String staffName;

    @Excel(name = "状态")
    private String status;

    @Excel(name = "添加时间")
    private String createTime;
}
