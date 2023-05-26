package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxFissionContact;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-渠道码结果集")
public class WxFissionContactVO extends WxFissionContact{

    @ApiModelProperty("客户信息")
    private WxCustomer customer;

    @ApiModelProperty("所属员工,前端决定展示几个")
    private List<Staff> StaffList;

    @ApiModelProperty("邀请来源")
    private WxCustomer origin;

    @ApiModelProperty("是否已完成")
    private Boolean hasFinish;

    @ApiModelProperty("是否已流失")
    private Boolean hasLose;

    @ApiModelProperty("已完成任务阶段")
    private Integer finishStage;

    @ApiModelProperty("邀请好友数")
    private Integer inviteNum;

    @ApiModelProperty("助力成功数")
    private Integer successNum;

    @ApiModelProperty("任务完成状态")
    private List<WxFissionTaskCustomerDetailVO> finishDetails;
}
