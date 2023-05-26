package com.scrm.api.wx.cp.dto;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.scrm.api.wx.cp.enums.WxMsgSendStatusEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/2/21 17:53
 * @description：客户群发，客户导出信息
 **/
@Data
@NoArgsConstructor
public class MsgTemplateCustomerExportDTO {

    @Excel(name = "客户昵称")
    private String customerName;

    @Excel(name = "消息送达状态")
    private String sendStatusCN;

    @Excel(name = "发送员工")
    private String staffName;

    @Excel(name = "发送时间", exportFormat = "YYYY-MM-dd HH:mm")
    private Date sendTime;

    public MsgTemplateCustomerExportDTO(WxMsgTemplateDetailDTO detailDTO) {

        this.customerName = detailDTO.getCustomerName();
        this.staffName = detailDTO.getStaffName();
        this.sendTime = detailDTO.getSendTime();
        this.sendStatusCN = WxMsgSendStatusEnum.getName(detailDTO.getSendStatus());

    }
}
