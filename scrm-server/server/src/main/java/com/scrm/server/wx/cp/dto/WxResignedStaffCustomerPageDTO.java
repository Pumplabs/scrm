package com.scrm.server.wx.cp.dto;

import com.scrm.server.wx.cp.entity.WxResignedStaffCustomer;
import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-06-26
 */
@Data
@ApiModel(value = "离职员工-客户关联分页请求参数")
@Accessors(chain = true)
public class WxResignedStaffCustomerPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

}

