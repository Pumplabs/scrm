package com.scrm.server.wx.cp.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * @author ouyang
 * @since 2022-05-20
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "待办新增DTO")
public class BrTodoSaveDTO {

    
    @ApiModelProperty(value = "待办名称")
    private String name;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

    @ApiModelProperty(value = "关联业务id")
    private String businessId;

    @ApiModelProperty(value = "状态 1:已完成 0:未完成")
    private Integer status;

    @ApiModelProperty(value = "待办类型 1:sop 2:群sop 3:跟进")
    private Integer type;

    @ApiModelProperty(value = "创建人")
    private String creator;

    @ApiModelProperty(value = "所属人id")
    private String ownerExtId;

    @ApiModelProperty(value = "关联业务id1")
    private String businessId1;

    @ApiModelProperty(value = "截止时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deadlineTime;
}
