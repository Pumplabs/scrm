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
 * 客户流失情况信息
 * @author xxh
 * @since 2022-03-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户流失情况信息")
@TableName(value = "wx_customer_loss_info", autoResultMap = true)
public class WxCustomerLossInfo implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "类型 1:客户删除员工 2:员工删除客户" )
    private Integer type;

    @ApiModelProperty(value = "客户ID")
    private String customerId;

    @ApiModelProperty(value = "客户extId")
    private String extCustomerId;

    @ApiModelProperty(value = "客户员工跟进ID")
    private String customerStaffId;

    @ApiModelProperty(value = "客户标签ID列表")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> tagExtIds;

    @ApiModelProperty(value = "所属客户旅程阶段ID列表")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> journeyStageIds;

    @ApiModelProperty(value = "员工ID")
    private String staffId;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deleteTime;

    @ApiModelProperty(value = "添加时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date addTime;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;


    /**
     * 客户删除员工
     */
    public static final Integer TYPE_CUSTOMER_DELETE_STAFF = 1;

    /**
     * 员工删除客户
     */
    public static final Integer TYPE_STAFF_DELETE_CUSTOMER = 2;

}
