package com.scrm.api.wx.cp.dto;

import cn.afterturn.easypoi.excel.annotation.Excel;
import lombok.Data;

import java.util.Date;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/6 20:46
 * @description：微信群群发-群聊详情，导出VO
 **/
@Data
public class MsgGroupChatExportDTO {

    @Excel(name = "群聊名称")
    private String name;

    @Excel(name = "群聊人数")
    private Integer total;

    @Excel(name = "群主名")
    private String ownerCN;

    @Excel(name = "群主所属部门")
    private String ownerDeptCN;

    @Excel(name = "消息送达状态")
    private String statusCN;

    @Excel(name = "群聊创建时间", exportFormat = "YYYY-MM-dd HH:mm:ss")
    private Date createdAt;
}
