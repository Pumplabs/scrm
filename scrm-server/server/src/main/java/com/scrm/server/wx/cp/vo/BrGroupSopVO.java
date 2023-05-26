package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Department;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.entity.WxGroupChatTag;
import com.scrm.server.wx.cp.entity.BrGroupSop;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群sop结果集")
public class BrGroupSopVO extends BrGroupSop{

    @ApiModelProperty("创建人名字")
    private String creatorCN;

    @ApiModelProperty(value = "规则集合")
    private List<BrGroupSopRuleVO> ruleList;

    @ApiModelProperty(value = "选择的群聊集合")
    List<WxGroupChat> groupChatList;

    @ApiModelProperty(value = "选择的标签集合")
    List<WxGroupChatTag> tagList;

    @ApiModelProperty(value = "选择群主员工集合")
    List<Staff> staffList;

    @ApiModelProperty(value = "选择群主部门集合")
    List<Department> departmentList;

}
