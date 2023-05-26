package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-05-20
 */
@Data
@ApiModel(value = "待办分页请求参数")
@Accessors(chain = true)
public class BrTodoPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "状态 1:已完成 0:未完成 2:已逾期")
    private Integer status;

}

