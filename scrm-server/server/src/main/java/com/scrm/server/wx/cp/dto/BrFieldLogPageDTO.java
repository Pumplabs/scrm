package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
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
@ApiModel(value = "字段变化记录分页请求参数")
@Accessors(chain = true)
public class BrFieldLogPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "数据库表名 br_opportunity:商机 br_clue:线索")
    @NotBlank(message = "数据库表名不能为空")
    private String tableName;

    @ApiModelProperty("数据主键id")
    @NotBlank(message = "数据主键id不能为空")
    private String dataId;
}

