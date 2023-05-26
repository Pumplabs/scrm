package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 企微应用宝-阶梯任务信息表
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-阶梯任务信息表")
@TableName(value = "wx_fission_stage", autoResultMap = true)
public class WxFissionStage implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "公司id")
    private String extCorpId;

    @ApiModelProperty(value = "任务id")
    private String taskId;

    @ApiModelProperty(value = "阶段，从小到大")
    private Integer stage;

    @ApiModelProperty(value = "任务目标人数")
    private Integer num;

    @ApiModelProperty(value = "任务达成标签")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> tags;

    @ApiModelProperty("领奖客服id")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> extStaffIds;

    @ApiModelProperty(value = "领奖客服渠道活码id")
    private String configId;

    @ApiModelProperty(value = "领奖客服渠道活码的state")
    private String state;

    @ApiModelProperty(value = "领奖客服渠道活码的请求路径")
    private String qrCode;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "更新时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;


}
