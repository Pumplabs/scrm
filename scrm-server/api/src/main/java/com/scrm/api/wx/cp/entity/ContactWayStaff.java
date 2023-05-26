package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * 渠道活码-员工信息
 * @author xxh
 * @since 2021-12-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "渠道活码-员工信息")
@TableName("wx_contact_way_staff")
public class ContactWayStaff implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "'渠道码ID'")
    private String contactWayId;

    @ApiModelProperty(value = "'员工累计添加客户计数'")
    private Integer addCustomerCount;

    @ApiModelProperty(value = "'员工每日添加客户计数'")
    private Integer dailyAddCustomerCount;

    @ApiModelProperty(value = "'员工每日添加客户上限'")
    private Integer dailyAddCustomerLimit;

    @ApiModelProperty("员工ID")
    private String staffId;

    @ApiModelProperty(value = "'外部员工ID'")
    private String extStaffId;

    @ApiModelProperty(value = "员工名")
    private String name;

    @ApiModelProperty(value = "头像地址")
    private String avatarUrl;

    @ApiModelProperty(value = "是否是备用员工")
    private Boolean isBackOut;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "'删除时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

}
