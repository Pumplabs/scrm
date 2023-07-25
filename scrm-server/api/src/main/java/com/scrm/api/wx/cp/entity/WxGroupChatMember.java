package com.scrm.api.wx.cp.entity;

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
 * 客户群聊成员
 *
 * @author xxh
 * @since 2022-01-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊成员")
@TableName("wx_group_chat_member")
public class WxGroupChatMember implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty("名字。仅当 need_name = 1 时返回,如果是微信用户，则返回其在微信中设置的名字,如果是企业微信联系人，则返回其设置对外展示的别名或实名")
    private String name;

    @ApiModelProperty(value = "在群里的昵称")
    private String groupNickname;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "群聊id")
    private String extChatId;

    @ApiModelProperty(value = "群成员id")
    private String userId;

    @ApiModelProperty(value = "群成员类型 1 - 企业成员 2 - 外部联系人")
    private Integer type;

    @ApiModelProperty(value = "入群时间")
    private Long joinTime;

    @ApiModelProperty(value = "入群方式 1 - 由群成员邀请入群（直接邀请入群）2 - 由群成员邀请入群（通过邀请链接入群）3 - 通过扫描群二维码入群")
    private Integer joinScene;

    @ApiModelProperty(value = "邀请者。目前仅当是由本企业内部成员邀请入群时会返回该值")
    private String invitor;

    @ApiModelProperty(value = "外部联系人在微信开放平台的唯一身份标识（微信unionid）")
    private String unionId;

    @ApiModelProperty(value = "退群时间")
    private Date quitTime;

//    @ApiModelProperty(value = "'删除时间'")
//    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
//    @TableLogic
//    private Date deletedAt;

    @TableLogic(value = "0", delval = "null")
    private Boolean hasDelete;

    @ApiModelProperty(value = "企业自定义的state参数")
    private String state;

    /**
     * 群成员类型 1 - 企业成员
     */
    public static final int TYPE_CORPORATE_MEMBER = 1;

    /**
     * 群成员类型 2 - 外部联系人
     */
    public static final int TYPE_EXTERNAL_CONTACT = 2;

}
