package com.scrm.common.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @Author: xxh
 * @Date: 2021/12/16 22:33
 */
@Data
@ApiModel(value = "分页请求参数")
public class BasePageDTO {

    @ApiModelProperty(value = "页码")
    @NotNull(message = "页码不能为空")
    @Min(value = 1,message = "页码必须大于零")
    private Integer pageNum;

    @ApiModelProperty(value = "页面容量")
    @NotNull(message = "页面容量不能为空")
    @Min(value = 1,message = "页面容量必须大于零")
    private Integer pageSize;
}
