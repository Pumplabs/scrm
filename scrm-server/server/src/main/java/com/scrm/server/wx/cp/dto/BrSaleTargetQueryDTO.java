package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-07-20
 */
@Data
@ApiModel(value = "销售目标条件查询请求参数")
@Accessors(chain = true)
public class BrSaleTargetQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("月份，和新增时传的参数一样")
    @NotNull(message = "月份必传")
    private String month;
}
