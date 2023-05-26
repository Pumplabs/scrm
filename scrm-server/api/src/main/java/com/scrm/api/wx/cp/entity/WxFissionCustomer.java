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
 * 企微应用宝-客户信息
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-客户信息")
@TableName("wx_fission_customer")
public class WxFissionCustomer implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "任务id")
    private String taskId;

    @ApiModelProperty(value = "邀请的客户id")
    private String extInviteCustomerId;

    @ApiModelProperty(value = "被邀请的客户id")
    private String extCustomerId;

    @ApiModelProperty(value = "被添加的员工id")
    private String extStaffId;

    @ApiModelProperty(value = "是否是首次添加，1->是，0->不是")
    private Boolean hasFirst;

    @ApiModelProperty(value = "客户是否已删除员工")
    private Boolean hasDeleted;

    @ApiModelProperty("完成的wx_fission_task_customer_detail的id（一开始是领奖的id，后面需求变更）")
    private String priceDetailId;

    @ApiModelProperty(value = "客户删除员工时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date customerDeletedAt;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "更新时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;


}
