package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2021-12-29
 */
@Data
@ApiModel(value = "企业微信标签组管理分页请求参数")
@Accessors(chain = true)
public class WxTagGroupPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "标签组/标签名称")
    private String keyword;

}

