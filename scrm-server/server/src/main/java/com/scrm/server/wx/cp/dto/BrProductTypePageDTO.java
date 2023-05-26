package com.scrm.server.wx.cp.dto;

import com.scrm.server.wx.cp.entity.BrProductType;
import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@ApiModel(value = "产品分类分页请求参数")
@Accessors(chain = true)
public class BrProductTypePageDTO extends BasePageDTO{

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

}

