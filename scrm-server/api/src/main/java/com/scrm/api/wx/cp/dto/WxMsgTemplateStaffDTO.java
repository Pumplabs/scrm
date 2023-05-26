package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/2/20 0:10
 * @description：客户群发员工结果
 **/
@ApiModel("客户群发员工结果")
@Data
public class WxMsgTemplateStaffDTO {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("外部id")
    private String extId;

    @ApiModelProperty("员工名")
    private String name;

    @ApiModelProperty("别名")
    private String alias;

    @ApiModelProperty("头像地址")
    private String avatarUrl;

    @ApiModelProperty("客户数量")
    private Integer customerCount;

    @ApiModelProperty("发送状态：0-未发送 1-已发送 2-因客户不是好友导致发送失败 3-因客户已经收到其他群发消息导致发送失败")
    private Integer status;

}
