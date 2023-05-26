package com.scrm.api.wx.cp.dto;

import cn.afterturn.easypoi.excel.annotation.Excel;
import lombok.Data;

import java.util.Date;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/6 21:03
 * @description：客户群群发，群主发送详情导出
 **/
@Data
public class MsgGroupStaffExportDTO {

    @Excel(name = "群主")
    private String ownerCN;

    @Excel(name = "群主所属部门")
    private String ownerDeptCN;

    @Excel(name = "群发送达状态")
    private String statusCN;

    @Excel(name = "本地发送群聊总数")
    private Integer total = 0;

    @Excel(name = "已发送群聊数")
    private Integer sendCount = 0;

    @Excel(name = "确认发送时间", exportFormat = "YYYY-MM-dd HH:mm:ss")
    private Date sendTime;
}
