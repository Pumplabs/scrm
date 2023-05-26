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
 * 客户群发
 * @author xxh
 * @since 2022-02-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群发")
@TableName(value = "wx_msg_template", autoResultMap = true)
public class WxMsgTemplate implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String creatorExtId;

    @ApiModelProperty(value = "是否定时发送，1->是，0->不是（立即发送）")
    private Boolean hasSchedule;

    @ApiModelProperty(value = "发送时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date sendTime;

    @ApiModelProperty(value = "消息内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO msg;

    @ApiModelProperty(value = "群发名称")
    private String name;
    
    @ApiModelProperty(value = "类型，0：企业发表 1：个人发表")
    private Boolean hasPerson;
    
    @ApiModelProperty(value = "是否全部员工")
    private Boolean hasAllStaff;

    @ApiModelProperty(value = "选择的员工id(extId)")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> staffIds;

    @ApiModelProperty(value = "是否全部客户,1是，0否")
    private Boolean hasAllCustomer;

    @ApiModelProperty(value = "筛选条件的性别，性别,0-未知 1-男性 2-女性,全部不需要传")
    private Integer sex;

    @ApiModelProperty(value = "筛选条件的群聊id")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> chatIds;

    @ApiModelProperty(value = "筛选条件的添加开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date addStartTime;

    @ApiModelProperty(value = "筛选条件的添加结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date addEndTime;

    @ApiModelProperty(value = "筛选条件的选择标签，1->满足其一，2->全部满足，3->无任何标签")
    private Integer chooseTagType;

    @ApiModelProperty(value = "选择的标签数组")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> chooseTags;

    @ApiModelProperty(value = "排除在外的标签")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> excludeTags;

    @ApiModelProperty(value = "是否开启客户去重，1->开启，0->关闭")
    private Boolean hasDistinct;

    @ApiModelProperty(value = "状态，0->待发送，1->发送成功，2->已取消，-1->创建失败，")
    private Integer status;

    @ApiModelProperty(value = "失败原因")
    private String failMsg;

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

    //筛选条件的选择标签，满足其一
    public static final Integer CHOOSE_TYPE_ANY = 1;

    //筛选条件的选择标签，全部
    public static final Integer CHOOSE_TYPE_ALL= 2;

    //筛选条件的选择标签，全部都不
    public static final Integer CHOOSE_TYPE_NONE = 3;

    //群发任务未创建（定时创建）
    public static final Integer STATUS_NO_CREATE = 0;

    //群发任务已创建，等待成员发送消息
    public static final Integer STATUS_WAIT = 1;

    //群发任务已取消
    public static final Integer STATUS_CANCEL = 2;

    //群发任务创建失败
    public static final Integer STATUS_FAIL = -1;
}
