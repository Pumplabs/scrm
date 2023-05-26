package com.scrm.server.wx.cp.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "商机修改请求参数")
public class BrOpportunityUpdateDTO {

    @ApiModelProperty(value = "主键")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "所属分组id")
    private String groupId;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "描述")
    private String desp;

    @ApiModelProperty(value = "优先级 1->高，2->中 3->低")
    private Integer priority;

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

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "所有者id")
    private String owner;

    @ApiModelProperty(value = "阶段id")
    private String stageId;

    @ApiModelProperty(value = "预计金额")
    private String expectMoney;

    @ApiModelProperty(value = "成单概率")
    private String dealChance;

    @ApiModelProperty(value = "预计成交日期")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date expectDealDate;

    @ApiModelProperty(value = "协作人列表")
    private List<BrOpportunityCooperatorSaveOrUpdateDTO> opportunityCooperatorList;

    @ApiModelProperty(value = "失败原因id")
    private String failReasonId;

    @ApiModelProperty(value = "失败原因")
    private String failReason;

    @ApiModelProperty(value = "客户extId")
    private String customerExtId;
}
