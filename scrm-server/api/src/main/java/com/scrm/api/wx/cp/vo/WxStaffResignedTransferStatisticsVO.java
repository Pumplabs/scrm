package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxStaffResignedTransferStatistics;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-14
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "员工离职继承统计结果集")
public class WxStaffResignedTransferStatisticsVO extends WxStaffResignedTransferStatistics{

    @ApiModelProperty(value = "员工信息")
    private StaffVO staff;

    @ApiModelProperty(value = "待交接员工数量")
    private Integer waitTransferCustomerNum;

    @ApiModelProperty(value = "待交接群聊数量")
    private Integer waitTransferGroupChatNum;

}
