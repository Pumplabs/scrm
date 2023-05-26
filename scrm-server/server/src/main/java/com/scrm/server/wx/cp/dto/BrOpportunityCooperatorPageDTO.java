package com.scrm.server.wx.cp.dto;

import com.scrm.server.wx.cp.entity.BrOpportunityCooperator;
import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@ApiModel(value = "商机-协作人关联分页请求参数")
@Accessors(chain = true)
public class BrOpportunityCooperatorPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

}

