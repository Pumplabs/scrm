package com.scrm.api.wx.cp.dto;

import cn.afterturn.easypoi.excel.annotation.Excel;
import io.swagger.annotations.ApiModel;
import lombok.Data;


@Data
@ApiModel("渠道码根据员工统计导出DTO")
public class ContactWayCountStaffExportDTO {

    @Excel(name = "员工名称")
    private String staffName;

    @Excel(name = "添加客户总数")
    private Integer totalNum;

    @Excel(name = "流失数")
    private Integer loseNum;

    @Excel(name = "净添加客户数")
    private Integer actualNum;
}
