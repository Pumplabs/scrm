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
 * 员工离职转接记录
 * @author xxh
 * @since 2022-03-10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "员工离职转接记录")
@TableName("wx_staff_resigned_transfer_info")
public class WxStaffResignedTransferInfo implements Serializable{

    private static final long serialVersionUID=1L;

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

    @ApiModelProperty(value = "客户ID")
    private String customerId;

    @ApiModelProperty(value = "接替成员ID")
    private String takeoverStaffId;

    @ApiModelProperty(value = "原添加成员ID")
    private String handoverStaffId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @ApiModelProperty(value = "操作人用户ID")
    private String creator;


}
