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
import javax.validation.constraints.NotEmpty;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群sop新增DTO")
public class BrGroupSopSaveDTO {

    
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
    private Date deletedAt;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "是否全部群聊：1->是，0->不是")
    private Boolean hasAllGroup;

    @ApiModelProperty(value = "选择群聊id集合")
    private List<String> groupIds;

    @ApiModelProperty(value = "群聊创建开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date startTime;

    @ApiModelProperty(value = "群聊创建结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date endTime;

    @ApiModelProperty(value = "群名关键字")
    private String groupName;

    @ApiModelProperty(value = "群标签")
    private List<String> groupTags;

    @ApiModelProperty(value = "选群主,部门id集合")
    private List<String> departmentIds;

    @ApiModelProperty(value = "选群主,群主id集合")
    private List<String> leaderIds;

    @ApiModelProperty(value = "规则集合")
    @NotEmpty(message = "规则不能为空")
    private List<BrGroupSopRuleSaveOrUpdateDTO> ruleList;

}
