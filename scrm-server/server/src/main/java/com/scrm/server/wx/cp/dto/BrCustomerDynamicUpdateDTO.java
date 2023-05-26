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
 * @author xxh
 * @since 2022-05-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户动态修改请求参数")
public class BrCustomerDynamicUpdateDTO {

    @ApiModelProperty(value = "主键")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "模块")
    private Integer model;

    @ApiModelProperty(value = "类型")
    private Integer type;

    @ApiModelProperty(value = "详情")
    private String info;

    @ApiModelProperty(value = "客户ID")
    private String customerId;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

}
