package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-07-20
 */
@Data
@ApiModel(value = "销售目标分页请求参数")
@Accessors(chain = true)
public class BrSaleTargetPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

}

