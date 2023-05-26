package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.server.wx.cp.handler.ListInteger2ListLongTypeHandler;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * sop
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "sop")
@TableName(value = "br_sop", autoResultMap = true)
public class BrSop implements Serializable{

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

    @ApiModelProperty(value = "是否全部客户,1是，0否")
    private Boolean hasAllCustomer;

    @ApiModelProperty(value = "选择的标签数组")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> chooseTags;

    @ApiModelProperty(value = "选择的员工id(extId)")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> staffIds;

    @ApiModelProperty(value = "选择的部门id集合(extId)")
    @TableField(typeHandler = ListInteger2ListLongTypeHandler.class)
    private List<Long> departmentIds;

    @ApiModelProperty(value = "选择的客户id集合(extId)")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> customerIds;

    //状态 1:已启用 0:已禁用
    public static final Integer ENABLE_STATUS = 1;
    public static final Integer DISABLE_STATUS = 0;

}
