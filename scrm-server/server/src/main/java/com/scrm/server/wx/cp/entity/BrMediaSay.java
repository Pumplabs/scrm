package com.scrm.server.wx.cp.entity;

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

/**
 * （素材库）企业话术
 * @author xxh
 * @since 2022-05-10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业话术")
@TableName(value = "br_media_say", autoResultMap = true)
public class BrMediaSay implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    private String extCorpId;

    @ApiModelProperty(value = "分组id")
    private String groupId;

    @ApiModelProperty(value = "话术内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO msg;

    @ApiModelProperty(value = "标题（查询字段）")
    private String title;

    @ApiModelProperty(value = "发送次数")
    private Integer sendNum;

    @ApiModelProperty("话术名")
    private String name;

    @ApiModelProperty(value = "创建者id")
    private String creatorExtId;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;


}
