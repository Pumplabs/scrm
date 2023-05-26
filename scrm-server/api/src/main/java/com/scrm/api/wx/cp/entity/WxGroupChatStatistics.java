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
 * 企业微信群聊统计信息
 * @author xxh
 * @since 2022-02-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信群聊统计信息")
@TableName("wx_group_chat_statistics")
public class WxGroupChatStatistics implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "群聊id")
    private String extChatId;

    @ApiModelProperty(value = "总人数")
    private Integer total;

    @ApiModelProperty(value = "客户总数")
    private Integer customerNum;

    @ApiModelProperty(value = "入群人数")
    private Integer joinMemberNum;

    @ApiModelProperty(value = "退群人数")
    private Integer quitMemberNum;

    @ApiModelProperty(value = "活跃人数")
    private Integer activeMemberNum;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    @ApiModelProperty(value = "创建日期")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date createDate;


}
