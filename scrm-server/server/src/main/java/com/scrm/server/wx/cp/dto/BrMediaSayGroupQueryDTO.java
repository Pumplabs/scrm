package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/10 17:30
 * @description：
 **/
@Data
@ApiModel(value = "企业话术分组条件查询请求参数")
@Accessors(chain = true)
public class BrMediaSayGroupQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("是否是个人分组")
    @NotNull(message = "请选择是否是个人分组")
    private Boolean hasPerson;
}
