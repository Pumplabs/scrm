package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 入群欢迎语
 *
 * @author xxh
 * @since 2022-04-24
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "入群欢迎语")
@TableName(value = "br_group_chat_welcome", autoResultMap = true)
public class BrGroupChatWelcome implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "消息内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO msg;

    @ApiModelProperty(value = "欢迎语素材id")
    private String templateId;

    @ApiModelProperty(value = "群聊extIds")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> groupChatExtIds;

    @ApiModelProperty(value = "是否通知群主")
    private Boolean isNoticeOwner;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "创建员工id")
    private String creator;

    @ApiModelProperty(value = "编辑员工id")
    private String editor;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;


}
