package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel(value = "旅程批量新增客户DTO")
public class BrJourneyStageCustomerBatchSaveDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "客户id列表",required = true)
    @NotNull(message = "客户不能为空")
    @Size(min = 1,message = "客户不能为空")
    private List<String> customerIds;

    @ApiModelProperty(value = "旅程阶段id",required = true)
    @NotBlank(message = "旅程阶段不能为空")
    private String journeyStageId;
}
