package com.scrm.api.wx.cp.entity;

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
 * 员工在职转接记录
 *
 * @author xxh
 * @since 2022-03-05
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "员工在职转接记录")
@TableName("wx_staff_transfer_info")
public class WxStaffTransferInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "接替状态， 1-接替完毕 2-等待接替 3-客户拒绝 4-接替成员客户达到上限 5-无接替记录")
    private Integer status;

    @ApiModelProperty(value = "接替客户的时间，如果是等待接替状态，则为未来的自动接替时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date takeoverTime;

    @ApiModelProperty(value = "客户extId")
    private String customerExtId;

    @ApiModelProperty(value = "接替成员extId")
    private String takeoverStaffExtId;

    @ApiModelProperty(value = "原添加成员extId")
    private String handoverStaffExtId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @ApiModelProperty(value = "操作人用户ID")
    private String creator;

    @ApiModelProperty(value = "类型：1:在职转接")
    private Integer type;

    //类型：在职转接
    public static final int TYPE_ON_JOB = 1;

    //类型：离职继承
    public static final int TYPE_RESIGN = 2;

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
