package com.scrm.api.wx.cp.dto;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.scrm.api.wx.cp.enums.WxMsgSendStatusEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/2/21 17:52
 * @description：客户群发，员工导出信息
 **/
@Data
@NoArgsConstructor
public class MsgTemplateStaffExportDTO {

    @Excel(name = "员工")
    private String name;

    @Excel(name = "发送顾客数量")
    private Integer customerCount;

    @Excel(name = "发送状态")
    private String statusCN;


    public MsgTemplateStaffExportDTO(WxMsgTemplateStaffDTO dto){
        this.name = dto.getName();
        this.customerCount = dto.getCustomerCount();
        this.statusCN = WxMsgSendStatusEnum.getName(dto.getStatus());
    }
}
