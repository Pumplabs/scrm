package com.scrm.server.wx.cp.dto;

import java.util.Date;

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
@ApiModel(value = "商机-协作人关联新增DTO")
public class BrOpportunityCooperatorSaveDTO {

    
    @ApiModelProperty(value = "协作人id")
    private String cooperatorId;

    @ApiModelProperty(value = "商机id")
    private String opportunityId;

    @ApiModelProperty(value = "创建员工id")
    private String creator;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "是否可编辑 1->是，0->否")
    private Boolean canUpdate;

}
