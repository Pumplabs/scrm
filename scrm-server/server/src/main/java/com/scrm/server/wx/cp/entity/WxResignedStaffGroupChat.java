package com.scrm.server.wx.cp.entity;

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
 * 离职员工-群聊关联
 *
 * @author xxh
 * @since 2022-06-27
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "离职员工-群聊关联")
@TableName("wx_resigned_staff_group_chat")
public class WxResignedStaffGroupChat implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "原群主成员ID")
    private String handoverStaffExtId;

    @ApiModelProperty(value = "原群主昵称")
    private String handoverStaffName;

    @ApiModelProperty(value = "客户群ID")
    private String groupChatExtId;

    @ApiModelProperty(value = "操作人用户ID")
    private String creator;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

}
