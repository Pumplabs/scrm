package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
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
 * 企业微信客户详情信息
 * @author xxh
 * @since 2021-12-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户详情信息")
@TableName("wx_customer_info")
public class WxCustomerInfo implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "'ID'")
    @TableId(value = "id",type = IdType.INPUT)
    private String id;

    @ApiModelProperty(value = "客户ID")
    private String customerId;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "微信客户ID")
    private String extCustomerId;

    @ApiModelProperty(value = "微信员工ID")
    private String extStaffId;

    @ApiModelProperty(value = "年龄")
    private Integer age;

    @ApiModelProperty(value = "邮箱")
    private String email;

    @ApiModelProperty(value = "电话")
    private String phoneNumber;

    @ApiModelProperty(value = "qq")
    private String qq;

    @ApiModelProperty(value = "地址")
    private String address;

    @ApiModelProperty(value = "生日")
    private String birthday;

    @ApiModelProperty(value = "微博")
    private String weibo;

    @ApiModelProperty(value = "自定义字段的值")
    private String remarkField;

    @ApiModelProperty(value = "性别,0-未知 1-男性 2-女性")
    private Integer gender;

    @ApiModelProperty(value = "所属企业名称")
    private String corpName;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

//    @ApiModelProperty(value = "'删除时间'")
//    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
//    @TableLogic
//    private Date deletedAt;

    @TableLogic(value = "0", delval = "null")
    private Boolean hasDelete;
}
