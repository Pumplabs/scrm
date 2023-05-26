package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@ApiModel(value = "通用配置分页请求参数")
@Accessors(chain = true)
public class BrCommonConfPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "类型编码")
    @NotBlank(message = "类型编码不能为空")
    private String typeCode;

    @ApiModelProperty(value = "所属分组id")
    private String groupId;

}

