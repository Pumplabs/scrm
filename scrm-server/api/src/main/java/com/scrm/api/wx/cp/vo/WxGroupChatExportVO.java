package com.scrm.api.wx.cp.vo;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @author xuxh
 * @date 2022/2/23 17:45
 */
@Data
@Accessors(chain = true)
public class WxGroupChatExportVO {

    @Excel(name = "群名字")
    private String name;

    @Excel(name = "群主名字")
    private String ownerName;

    @Excel(name = "群主所属部门")
    private String ownerDeptName;

    @Excel(name = "群人数")
    private Integer total;

    @Excel(name = "今日进群人数")
    private Integer todayJoinMemberNum;

    @Excel(name = "今日退群人数")
    private Integer todayQuitMemberNum;

    @Excel(name = "群标签")
    private String tagStr;

    @Excel(name = "创建时间", exportFormat = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

}
