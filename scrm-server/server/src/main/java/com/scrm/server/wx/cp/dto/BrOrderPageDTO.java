package com.scrm.server.wx.cp.dto;

import com.scrm.server.wx.cp.entity.BrOrder;
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
@ApiModel(value = "订单分页请求参数")
@Accessors(chain = true)
public class BrOrderPageDTO extends BasePageDTO{

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "订单状态 1:待审核 2:已确定 3:已完成 4:审核不通过")
    private Integer status;

    @ApiModelProperty(value = "订单编号")
    private String orderCode;

}

