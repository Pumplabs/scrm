package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 离职员工-客户关联
 * @author xxh
 * @since 2022-06-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "离职员工-客户关联")
@TableName("wx_resigned_staff_customer")
public class WxResignedStaffCustomer implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "是否移交")
    private Boolean isHandOver;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "接替状态， 1-接替完毕 2-等待接替 3-客户拒绝 4-接替成员客户达到上限 5-无接替记录")
    private Integer status;

    @ApiModelProperty(value = "接替客户的时间，如果是等待接替状态，则为未来的自动接替时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date takeoverTime;

    @ApiModelProperty(value = "客户ID")
    private String customerExtId;

    @ApiModelProperty(value = "接替成员ID")
    private String takeoverStaffExtId;

    @ApiModelProperty(value = "原添加成员ID")
    private String handoverStaffExtId;

    @ApiModelProperty(value = "成员离职时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date dimissionTime;

    @ApiModelProperty(value = "操作人用户ID")
    private String creator;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @ApiModelProperty(value = "分配时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date allocateTime;


    //接替状态: 1-接替完毕
    public static final Integer STATUS_TAKE_OVER = 1;

    //接替状态: 2-等待接替
    public static final Integer STATUS_WAITING_TAKE_OVER = 2;

    //接替状态: 3-客户拒绝
    public static final Integer STATUS_CUSTOMER_REJECTS = 3;

    //接替状态: 4-接替成员客户达到上限
    public static final Integer STATUS_UPPER_LIMIT = 4;

    //接替状态: 5-无接替记录
    public static final Integer STATUS_SUCCESSION_RECORD = 5;


}
