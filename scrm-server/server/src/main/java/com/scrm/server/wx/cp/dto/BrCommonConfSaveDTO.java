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
@ApiModel(value = "通用配置新增DTO")
public class BrCommonConfSaveDTO {

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "名称")
    @NotBlank(message = "名称不能为空")
    private String name;

    @ApiModelProperty(value = "颜色")
    private String color;

    @ApiModelProperty(value = "状态 1:系统默认 0:非系统默认")
    private Boolean isSystem;

    @ApiModelProperty(value = "编码")
    private Integer code;

    @ApiModelProperty(value = "类型编码 OPPORTUNITY_STAGE:商机阶段 OPPORTUNITY_FAIL_REASON:商机输单原因 CLUE_SOURCE:线索来源")
    @NotBlank(message = "类型编码不能为空")
    private String typeCode;

    @ApiModelProperty(value = "所属分组id")
    private String groupId;

    @ApiModelProperty(value = "排序")
    private Integer sort;

}
