package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-06-17
 */
@Data
@ApiModel(value = "字段变化记录条件查询请求参数")
@Accessors(chain = true)
public class BrFieldLogQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "数据库表名")
    private String tableName;

    @ApiModelProperty("数据id")
    private String dataId;

}
