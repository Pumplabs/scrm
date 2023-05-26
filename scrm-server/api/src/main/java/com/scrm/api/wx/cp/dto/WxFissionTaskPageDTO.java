package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-03-21
 */
@Data
@ApiModel(value = "企微应用宝-裂变任务信息分页请求参数")
@Accessors(chain = true)
public class WxFissionTaskPageDTO extends BasePageDTO {

    @ApiModelProperty("企业id")
    @NotNull(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("任务名")
    private String name;
}

