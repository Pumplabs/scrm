package com.scrm.api.wx.cp.vo;

import cn.afterturn.easypoi.excel.annotation.Excel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

/**
 * @author xuxh
 * @date 2022/5/5 15:20
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群成员导出结果集")
public class WxGroupChatMemberExportVO {

    @Excel(name = "群成员昵称", width = 25)
    private String memberName;

    @Excel(name = "类型", replace = {"企业成员_1", "外部联系人_2"}, width = 25)
    private Integer type;

    @Excel(name = "入群时间", exportFormat = "yyyy-MM-dd HH:mm:ss", width = 25)
    private Date joinTime;

    @Excel(name = "入群方式", replace = {"由群成员邀请入群_1", "由群成员邀请入群_2", "通过扫描群二维码入群_3"}, width = 25)
    private Integer joinScene;

    @Excel(name = "邀请员工", width = 25)
    private String invitorName;

    @Excel(name = "unionid", width = 25)
    private String unionId;

}
