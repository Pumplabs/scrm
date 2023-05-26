package com.scrm.api.wx.cp.dto;


import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@ApiModel(value = "企业员工转移客户DTO")
@Accessors(chain = true)
public class StaffOnJobTransferCustomerDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "接替成员ID", required = true)
    @NotBlank(message = "接替成员ID不能为空")
    private String takeoverStaffId;

    @ApiModelProperty(value = "转移客户ID列表", required = true)
    @NotNull(message = "转移客户不能为空")
    @Size(min = 1, message = "转移客户不能为空")
    private List<WxCustomerStaff> customerStaffIds;

    @ApiModelProperty(value = "消息提示", required = true)
    @NotBlank(message = "消息提示不能为空")
    private String transferMsg;

}
