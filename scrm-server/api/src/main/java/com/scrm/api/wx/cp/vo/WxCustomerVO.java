package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.*;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * @author xxh
 * @since 2021-12-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户结果集")
public class WxCustomerVO extends WxCustomer {

    @ApiModelProperty(value = "创建者名称")
    private String extCreatorName;

    @ApiModelProperty(value = "创建者头像")
    private String extCreatorAvatar;

    @ApiModelProperty(value = "添加此客户的来源,0-未知来源 1-扫描二维码 2-搜索手机号 3-名片分享 4-群聊 5-手机通讯录 6-微信联系人 7-来自微信的添加好友申请 8-安装第三方应用时自动添加的客服人员 9-搜索邮箱 201-内部成员共享 202-管理员/负责人分配")
    private String addWay;

    @ApiModelProperty(value = "添加此客户的来源翻译")
    private String addWayName;

    @ApiModelProperty(value = "客户详情信息")
    private WxCustomerInfo customerInfo;

    @ApiModelProperty(value = "创建者信息")
    private StaffVO creatorStaff;

    @ApiModelProperty(value = "客户标签列表")
    private List<WxTag> tags;

    @ApiModelProperty(value = "跟进员工列表")
    private List<StaffFollowVO> followStaffList;

    @ApiModelProperty(value = "关联群聊列表")
    private List<WxGroupChat> groupChatList;

    @ApiModelProperty(value = "转移情况")
    private WxStaffTransferInfo staffTransferInfo;

    @ApiModelProperty(value = "旅程列表")
    private List<WxCustomerJourneyVO> journeyList;

    @ApiModelProperty(value = "客户所在旅程阶段ID列表")
    private List<String> customerStageIdList;

    @ApiModelProperty(value = "员工对客户的备注")
    private String remark;

    @ApiModelProperty(value = "员工对此客户的描述")
    private String description;

    @ApiModelProperty(value = "员工对客户备注的企业名称")
    private String remarkCorpName;

    @ApiModelProperty(value = "对此客户备注的手机号码")
    private List<String> remarkMobiles;

    @ApiModelProperty(value = "协助人列表")
    private List<Staff> assistStaffList;

    @ApiModelProperty(value = "是否为该客户的协助人")
    private Boolean isAssist;

}
