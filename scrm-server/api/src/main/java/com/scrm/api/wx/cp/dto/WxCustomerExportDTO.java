package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;

/**
 * @Author: xxh
 * @Date: 2022/1/2 16:20
 */
@Data
@ApiModel(value = "企业微信客户导出DTO")
public class WxCustomerExportDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "客户名称")
    private String name;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "'填加时间-开始'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtBegin;

    @ApiModelProperty(value = "'填加时间-结束'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtEnd;

    @ApiModelProperty(value = "性别,0-未知 1-男性 2-女性")
    private Integer gender;

    @ApiModelProperty(value = "类型,1-微信用户, 2-企业微信用户")
    private Integer type;
}
