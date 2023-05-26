package com.scrm.server.wx.cp.dto;

import com.scrm.server.wx.cp.entity.BrOrderProduct;
import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-07-25
 */
@Data
@ApiModel(value = "订单-产品关联分页请求参数")
@Accessors(chain = true)
public class BrOrderProductPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

}

