package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-03-22
 */
@Data
@ApiModel(value = "渠道码，过期时间表分页请求参数")
@Accessors(chain = true)
public class WxContactExpirationPageDTO extends BasePageDTO {

    @ApiModelProperty("企业id")
    @NotNull(message = "企业id不能为空")
    private String extCorpId;

}

