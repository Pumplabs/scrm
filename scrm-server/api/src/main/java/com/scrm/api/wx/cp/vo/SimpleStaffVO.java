package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/5 23:34
 * @description：简单员工信息
 **/
@ApiModel("简单的员工信息")
@Data
public class SimpleStaffVO {

    private String extId;

    @ApiModelProperty("员工名字")
    private String name;

    @ApiModelProperty("员工头像地址")
    private String avatarUrl;

    @ApiModelProperty("员工所在部门名")
    private String deptCN;
}
