package com.scrm.api.wx.cp.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 *
 * @author xxh
 * @since 2021-12-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "员工-部门关联")
@TableName("wx_staff_department")
public class StaffDepartment implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "员工ID")
    private String staffId;

    @ApiModelProperty(value = "部门id")
    private String departmentId;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "企业成员id")
    private String extStaffId;

    @ApiModelProperty(value = "企业部门id")
    private Long extDepartmentId;

    @ApiModelProperty(value = "是否是所在部门的领导 1表示为部门负责人，0表示非部门负责人")
    private Integer isLeader;

    @ApiModelProperty(value = "所在部门的排序")
    @TableField("`order`")
    private Integer order;



}
