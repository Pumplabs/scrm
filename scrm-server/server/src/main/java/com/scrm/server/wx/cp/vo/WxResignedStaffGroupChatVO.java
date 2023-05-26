package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.api.wx.cp.vo.WxGroupChatVO;
import com.scrm.server.wx.cp.entity.WxResignedStaffGroupChat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-06-27
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "离职员工-群聊关联结果集")
public class WxResignedStaffGroupChatVO extends WxResignedStaffGroupChat{

    @ApiModelProperty(value = "原群主")
    private StaffVO handoverStaff;

    @ApiModelProperty(value = "客户群")
    private WxGroupChatVO groupChat;
}
