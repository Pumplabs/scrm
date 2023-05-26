package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 渠道活码
 * @author xxh
 * @since 2021-12-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "渠道活码")
@TableName(value = "wx_contact_way", autoResultMap = true)
public class ContactWay implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "'渠道码名称'")
    private String name;

    @ApiModelProperty(value = "渠道码配置ID")
    private String configId;

    @ApiModelProperty(value = "活码分组ID")
    private String groupId;

    @ApiModelProperty(value = "联系二维码的URL")
    private String qrCode;

    @ApiModelProperty(value = "渠道码的备注信息")
    private String remark;

    @ApiModelProperty(value = "外部客户添加时是否无需验证，假布尔类型")
    private Boolean skipVerify;

    @ApiModelProperty(value = "企业自定义的state参数")
    private String state;

    @ApiModelProperty(value = "扫码添加人次")
    private Integer addCustomerCount;

    @ApiModelProperty(value = "'欢迎语类型：1，渠道欢迎语；2, 渠道默认欢迎语；3，不送欢迎语；'")
    private Integer autoReplyType;

    @ApiModelProperty(value = "欢迎语策略字符串")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO replyInfo;

    @ApiModelProperty(value = "客户描述")
    private String customerDesc;

    @ApiModelProperty(value = "是否开启客户描述")
    private Boolean customerDescEnable;

    @ApiModelProperty(value = "客户备注")
    private String customerRemark;

    @ApiModelProperty(value = "是否开启客户备注")
    private Boolean customerRemarkEnable;

    @ApiModelProperty(value = "是否开启员工每日添加上限")
    private Boolean dailyAddCustomerLimitEnable;

    @ApiModelProperty(value = "员工每日添加上限")
    private Integer dailyAddCustomerLimit;

    @ApiModelProperty(value = "'是否自动打标签'")
    private Boolean autoTagEnable;

    @ApiModelProperty(value = "'自动打标签绑定的标签ExtID数组'")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> customerTagExtIds;

    @ApiModelProperty(value = "'员工id集合'")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> staffIds;

    @ApiModelProperty(value = "'备用员工id集合'")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> backOutStaffIds;

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
    @TableLogic
    private Date deletedAt;

    //渠道欢迎语
    public static final int REPLY_SELF = 1;

    //渠道默认欢迎语
    public static final int REPLY_DEFAULT = 2;

    //不送欢迎语
    public static final int REPLY_NO = 3;
}
