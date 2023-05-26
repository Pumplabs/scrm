package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.dto.WxMsgTemplateDetailDTO;
import com.scrm.api.wx.cp.dto.WxMsgTemplateStaffDTO;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxMsgTemplate;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2022-02-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群发结果集")
public class WxMsgTemplateVO extends WxMsgTemplate {

    @ApiModelProperty("创建者信息")
    private Staff staff;

    @ApiModelProperty("已发送成员人数")
    private Integer sendStaffCount = 0;

    @ApiModelProperty("未发送成员人数")
    private Integer noSendStaffCount = 0;

    @ApiModelProperty("已发送客户人数")
    private Integer sendCustomer = 0;

    @ApiModelProperty("未发送客户人数")
    private Integer noSendCustomer = 0;

    @ApiModelProperty("不是好友客户人数")
    private Integer noFriendCustomer = 0;

    @ApiModelProperty("发送上线客户数")
    private Integer otherSendCustomer= 0;

    @ApiModelProperty("成员详情")
    private List<WxMsgTemplateStaffDTO> staffList;

    @ApiModelProperty("客户详情")
    private List<WxMsgTemplateDetailDTO> customerList;

    @ApiModelProperty(value = "排除在外的标签名")
    private List<String> chooseTagNames;

    @ApiModelProperty(value = "排除在外的标签名")
    private List<String> excludeTagNames;

    @ApiModelProperty(value = "群聊名")
    private List<String> chatNames;
}
