package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @author ouyang
 * @since 2022-06-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "跟进任务新增更新DTO")
public class BrFollowTaskSaveOrUpdateDTO {

    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "任务内容")
    @Length(max = 30, message = "任务内容不能超过30字")
    private String name;

    @ApiModelProperty(value = "负责人extId")
    private String owner;

    @ApiModelProperty(value = "完成时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date finishAt;

    @ApiModelProperty(value = "状态 1:已完成 0:未完成 2:已逾期 新增不用传")
    private Integer status;
}
