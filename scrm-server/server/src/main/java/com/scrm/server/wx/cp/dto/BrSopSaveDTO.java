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
import javax.validation.constraints.NotNull;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "sop新增DTO")
public class BrSopSaveDTO {

    
    @ApiModelProperty(value = "名称")
    @NotBlank(message = "名称不能为空")
    private String name;

    @ApiModelProperty(value = "触发条件 1:时间 2:添加好友 3:创建群聊")
    @NotNull(message = "触发条件不能为空")
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

    @ApiModelProperty(value = "是否全部客户,1是，0否")
    private Boolean hasAllCustomer;

    @ApiModelProperty(value = "选择的标签数组")
    private List<String> chooseTags;

    @ApiModelProperty(value = "选择的员工id集合(extId)")
    private List<String> staffIds;

    @ApiModelProperty(value = "规则集合")
    @NotEmpty(message = "规则不能为空")
    private List<BrSopRuleSaveOrUpdateDTO> ruleList;

    @ApiModelProperty(value = "选择的部门id集合(extId)")
    private List<String> departmentIds;

    @ApiModelProperty(value = "选择的客户id集合(extId)")
    private List<String> customerIds;

}
