package com.scrm.server.wx.cp.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "产品分类新增DTO")
public class BrProductTypeSaveDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "分类名称(限20字)", required = true)
    @NotBlank(message = "分类名称不能为空")
    @Length(max = 20, message = "分类名称不能超过20字")
    private String name;

    @ApiModelProperty(value = "描述(限150字)")
    @Length(max = 20, message = "描述不能超过150字")
    private String description;


}
