package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Department;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.server.wx.cp.entity.BrSop;
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
@ApiModel(value = "sop结果集")
public class BrSopVO extends BrSop{

    @ApiModelProperty("创建人名字")
    private String creatorCN;

    @ApiModelProperty(value = "选择的标签名")
    private List<String> chooseTagNames;

    @ApiModelProperty(value = "规则集合")
    private List<BrSopRuleVO> ruleList;

    @ApiModelProperty(value = "选择的群聊信息")
    private List<Department> departmentList;

    @ApiModelProperty(value = "选择的员工信息")
    private List<Staff> staffList;

    @ApiModelProperty(value = "选择的客户信息")
    private List<WxCustomer> customerList;

}
