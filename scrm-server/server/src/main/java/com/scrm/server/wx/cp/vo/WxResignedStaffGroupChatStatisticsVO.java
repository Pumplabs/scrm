package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.vo.StaffVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/***
 * @author xuxh
 * @date 2022/7/4 16:03
 */
@Data
@ApiModel(value = "群聊离职继承统计结果集")
@Accessors(chain = true)
public class WxResignedStaffGroupChatStatisticsVO {

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "原群主信息")
    private StaffVO handoverStaff;

    @ApiModelProperty(value = "原群主extId")
    private String handoverStaffExtId;

    @ApiModelProperty("待分配群聊数")
    private Integer waitAssignNum;



}
