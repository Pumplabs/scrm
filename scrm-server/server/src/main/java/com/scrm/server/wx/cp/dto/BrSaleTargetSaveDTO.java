package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * @author xxh
 * @since 2022-07-20
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "销售目标新增DTO")
public class BrSaleTargetSaveDTO {

    
    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "月份，格式YYYY-MM")
    @NotNull(message = "月份，不能为空")
    @Pattern(regexp = "^\\d{4}-\\d{1,2}", message = "日期格式错误")
    private String month;

    @ApiModelProperty(value = "员工extId")
    @NotNull(message = "员工id不能为空")
    private String staffExtId;

    @ApiModelProperty(value = "本月目标(元)")
    @NotNull(message = "目标不能为空")
    private Integer target;
    
}
