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
 * 企微应用宝-领奖信息
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-客户完成任务详情")
@TableName(value = "wx_fission_task_customer_detail", autoResultMap = true)
public class WxFissionTaskCustomerDetail implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "公司id")
    private String extCorpId;

    @ApiModelProperty(value = "任务id")
    private String taskId;

    @ApiModelProperty(value = "阶梯")
    private Integer stage;

    @ApiModelProperty(value = "客户id")
    private String extCustomerId;

    @ApiModelProperty(value = "发奖员工id")
    private String staffId;

    @ApiModelProperty("是否完成该阶段任务")
    private Boolean hasFinish;

    @ApiModelProperty("是否已领奖")
    private Boolean hasPrize;

    @ApiModelProperty(value = "领奖时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date prizeAt;

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
