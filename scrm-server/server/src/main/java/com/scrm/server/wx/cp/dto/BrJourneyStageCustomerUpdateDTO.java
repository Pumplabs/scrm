package com.scrm.server.wx.cp.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-04-06
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "旅程阶段-客户关联修改请求参数")
public class BrJourneyStageCustomerUpdateDTO {

    @ApiModelProperty(value = "主键")
    private String id;

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "客户id",required = true)
    @NotBlank(message = "客户不能为空")
    private String customerId;

    @ApiModelProperty(value = "旅程阶段id",required = true)
    @NotBlank(message = "旅程阶段不能为空")
    private String journeyStageId;

}
