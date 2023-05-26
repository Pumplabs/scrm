package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.server.wx.cp.handler.ListInteger2ListLongTypeHandler;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 群sop
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群sop")
@TableName(value = "br_group_sop", autoResultMap = true)
public class BrGroupSop implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键id")
    @TableId
    private String id;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "触发条件 1:时间 2:添加好友 3:创建群聊")
    private Integer term;

    @ApiModelProperty(value = "状态 1:已启用 0:已禁用")
    private Integer status;

    @ApiModelProperty(value = "创建人")
    private String creator;

    @ApiModelProperty(value = "更新人")
    private String editor;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "是否全部群聊：1->是，0->不是")
    private Boolean hasAllGroup;

    @ApiModelProperty(value = "选择群聊id集合")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> groupIds;

    @ApiModelProperty(value = "群聊创建开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @TableField(updateStrategy = FieldStrategy.IGNORED)
    private Date startTime;

    @ApiModelProperty(value = "群聊创建结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @TableField(updateStrategy = FieldStrategy.IGNORED)
    private Date endTime;

    @ApiModelProperty(value = "群名关键字")
    private String groupName;

    @ApiModelProperty(value = "群标签")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> groupTags;

    @ApiModelProperty(value = "选群主,部门id集合(extId)")
    @TableField(typeHandler = ListInteger2ListLongTypeHandler.class)
    private List<Long> departmentIds;

    @ApiModelProperty(value = "选群主,群主id集合(extId)")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> leaderIds;

    //状态 1:已启用 0:已禁用
    public static final Integer ENABLE_STATUS = 1;
    public static final Integer DISABLE_STATUS = 0;

}
