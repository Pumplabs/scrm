package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * @author xxh
 * @since 2022-05-15
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "素材统计表新增DTO")
public class BrMediaCountSaveDTO {

    @NotBlank(message = "企业id")
    private String extCorpId;

    @NotNull(message = "类型不能为空")
    @ApiModelProperty(value = "必，类型，1->素材，2->话术")
    private Integer type;

    @NotNull(message = "类型的id不能为空")
    @ApiModelProperty(value = "必，类型的id")
    private String typeId;

    @NotNull(message = "发送的次数不能为空")
    @ApiModelProperty(value = "必，发送的次数")
    private Integer sendCount;

    @NotNull(message = "发送的客户不能为空")
    @ApiModelProperty(value = "必，发送的客户")
    private String extCustomerId;

    private Date today;
}
