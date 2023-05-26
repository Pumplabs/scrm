package com.scrm.api.wx.cp.vo;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel(value = "离职客户群转移结果VO")
public class StaffTransferGroupChatVO {

    @ApiModelProperty(value = "成功转移列表")
    private List<StaffTransferGroupChatInfoVO> succeedList;

    @ApiModelProperty(value = "失败转移列表")
    private List<StaffTransferGroupChatInfoVO> failList;

    @ApiModelProperty(value = "成功条数")
    private int succeedTotal;

    @ApiModelProperty(value = "失败条数")
    private int failTotal;
}
