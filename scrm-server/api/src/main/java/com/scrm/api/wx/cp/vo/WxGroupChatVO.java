package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.*;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * @author xxh
 * @since 2022-01-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群结果集")
public class WxGroupChatVO extends WxGroupChat{


    @ApiModelProperty(value = "群主信息")
    private StaffVO ownerInfo;

    @ApiModelProperty(value = "标签列表")
    private List<WxGroupChatTag> tags;

    @ApiModelProperty(value = "今日进群人数")
    private Integer todayJoinMemberNum;

    @ApiModelProperty(value = "今日退群人数")
    private Integer todayQuitMemberNum;

/*    @ApiModelProperty(value = "转移情况")
    private WxGroupChatTransferInfo groupChatTransferInfo;*/

}
