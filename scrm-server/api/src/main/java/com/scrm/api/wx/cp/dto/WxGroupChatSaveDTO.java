package com.scrm.api.wx.cp.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-01-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群新增DTO")
public class WxGroupChatSaveDTO {


    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "群聊id")
    private String extChatId;

    @ApiModelProperty(value = "群名字")
    private String name;

    @ApiModelProperty(value = "群主ExtID")
    private String owner;

    @ApiModelProperty(value = "群主名字")
    private String ownerName;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @ApiModelProperty(value = "群公告")
    private String notice;

    @ApiModelProperty(value = "群管理员列表")
    private String adminList;

    @ApiModelProperty(value = "群状态 1-解散 2-未解散")
    private Integer status;

    @ApiModelProperty(value = "群人数")
    private Integer total;

    @ApiModelProperty(value = "客户总数")
    private Integer customerNum;

    @ApiModelProperty(value = "今日进群人数")
    private Integer todayJoinMemberNum;

    @ApiModelProperty(value = "今日退群人数")
    private Integer todayQuitMemberNum;

    private String ownerAvatarUrl;

    private String ownerRoleType;

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

}
