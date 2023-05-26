package com.scrm.server.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * （素材库）企业微信话术组管理
 * @author xxh
 * @since 2022-05-10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业微信话术组管理")
@TableName(value = "br_media_say_group", autoResultMap = true)
public class BrMediaSayGroup implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "是否是默认分组")
    private Boolean hasDefault;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String creatorExtId;

    @ApiModelProperty(value = "组名字")
    private String name;

    @ApiModelProperty("是否是个人分组")
    private Boolean hasPerson;

    @ApiModelProperty(value = "该标签组可用部门列表")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> departmentList;

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
