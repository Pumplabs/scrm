package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxTag;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 *
 * @author xuxh
 * @date 2022/5/13 11:01
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信员工跟进VO")
public class StaffFollowVO extends Staff {

    @ApiModelProperty(value = "客户标签列表")
    private List<WxTag> tags;

    @ApiModelProperty(value = "添加此客户的来源,0-未知来源 1-扫描二维码 2-搜索手机号 3-名片分享 4-群聊 5-手机通讯录 6-微信联系人 7-来自微信的添加好友申请 8-安装第三方应用时自动添加的客服人员 9-搜索邮箱 201-内部成员共享 202-管理员/负责人分配")
    private String addWay;

    @ApiModelProperty(value = "添加此客户的来源翻译")
    private String addWayName;

}
