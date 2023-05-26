package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;


@Data
@ApiModel("员工离职-分配客户群DTO")
public class WxStaffResignedTransferGroupChatDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "分配客户群extId列表", required = true)
    @NotNull(message = "分配客户群不能为空")
    @Size(min = 1, message = "分配客户群不能为空")
    private List<String> groupChatExtIds;

    @ApiModelProperty(value = "接替群主员工extId",required = true)
    @NotBlank(message = "接替群主不能为空")
    private String takeoverStaffExtId;

}
