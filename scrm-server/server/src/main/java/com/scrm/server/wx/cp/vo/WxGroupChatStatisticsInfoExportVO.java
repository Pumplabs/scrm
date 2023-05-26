package com.scrm.server.wx.cp.vo;

import cn.afterturn.easypoi.excel.annotation.Excel;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

/**
 * @author xuxh
 * @date 2022/5/5 16:21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群聊统计信息导出VO")
public class WxGroupChatStatisticsInfoExportVO {

    @Excel(name = "日期", exportFormat = "YYYY-MM-dd", width = 25)
    private Date createDate;

    @Excel(name = "总人数", width = 25)
    private Integer total;

    @Excel(name = "入群人数", width = 25)
    private Integer joinMemberNum;

    @Excel(name = "退群人数", width = 25)
    private Integer quitMemberNum;

    @Excel(name = "活跃人数", width = 25)
    private Integer activeMemberNum;
}
