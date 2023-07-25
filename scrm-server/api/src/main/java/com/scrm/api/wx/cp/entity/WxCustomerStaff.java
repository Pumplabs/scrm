package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.*;
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
 * 企业微信客户-员工跟进情况
 * @author xxh
 * @since 2021-12-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户-员工跟进情况")
@TableName(value = "wx_customer_staff",autoResultMap = true)
public class WxCustomerStaff implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "'ID'")
    @TableId(value = "id",type = IdType.INPUT)
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "客户ID")
    private String customerId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "员工ID")
    private String extStaffId;

    @ApiModelProperty(value = "客户ID")
    private String extCustomerId;

    @ApiModelProperty(value = "是否移除员工")
    private Boolean isDeletedStaff;

    @ApiModelProperty(value = "员工添加客户的时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @ApiModelProperty(value = "员工对客户的备注")
    private String remark;

    @ApiModelProperty(value = "员工对此客户的描述")
    private String description;

    @ApiModelProperty(value = "员工对客户备注的企业名称")
    private String remarkCorpName;

    @ApiModelProperty(value = "备注图片的mediaid")
    private String remarkPicMediaid;

    @ApiModelProperty(value = "对此客户备注的手机号码")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> remarkMobiles;

    @ApiModelProperty(value = "添加此客户的来源,0-未知来源 1-扫描二维码 2-搜索手机号 3-名片分享 4-群聊 5-手机通讯录 6-微信联系人 7-来自微信的添加好友申请 8-安装第三方应用时自动添加的客服人员 9-搜索邮箱 201-内部成员共享 202-管理员/负责人分配")
    private String addWay;

    @ApiModelProperty(value = "发起添加的userid")
    private String operUserId;

    @ApiModelProperty(value = "区分客户具体是通过哪个「联系我」添加，由企业通过创建「联系我」方式指定")
    private String state;

    @ApiModelProperty(value = "是否已发送通知 1-是 2-否")
    private String isNotified;

    private String signature;

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

    @TableLogic(value = "0", delval = "null")
    private Boolean hasDelete;
}
