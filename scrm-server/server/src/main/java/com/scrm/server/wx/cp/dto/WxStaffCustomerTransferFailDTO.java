package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import java.util.Objects;

@Data
@ApiModel(value = "客户移交失败请求参数")
@Accessors(chain = true)
public class WxStaffCustomerTransferFailDTO {

    @ApiModelProperty(value = "客户extId")
    private String customerExtId;

    @ApiModelProperty(value = "企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "错误原因")
    private String failReason;

    @ApiModelProperty(value = "接替状态， 1-接替完毕 2-等待接替 3-客户拒绝 4-接替成员客户达到上限 5-无接替记录")
    private Integer status;

    @ApiModelProperty(value = "接替员工extId")
    private String takeoverStaffExtId;

    public Integer getStatus() {
        if (Objects.equals("customer_refused", failReason)) {
            return 3;
        } else if (Objects.equals("customer_limit_exceed", failReason)) {
            return 4;
        }
        return 2;
    }

}
