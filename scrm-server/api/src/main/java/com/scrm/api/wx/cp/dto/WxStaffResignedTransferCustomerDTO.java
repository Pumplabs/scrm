package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

/**
 * @author xuxh
 * @date 2022/3/9 11:01
 */
@Data
@ApiModel("员工离职-分配客户DTO")
public class WxStaffResignedTransferCustomerDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "原跟进员工ID",required = true)
    @NotBlank(message = "原跟进员工ID不能为空")
    private String handoverStaffExtId;

    @ApiModelProperty(value = "接替员工extId",required = true)
    @NotBlank(message = "接替员工extId不能为空")
    private String takeoverStaffExtId;

    @ApiModelProperty(value = "成员离职时间",required = true)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @NotNull(message = "成员离职时间不能为空")
    private Date dimissionTime;


    @ApiModelProperty(value = "客户ID列表")
    @NotNull(message = "转移客户不能为空")
    @Size(min = 1,message = "转移客户不能为空")
    private List<String> customerExtIds;

    @ApiModelProperty(value = "消息提示", required = true)
    @NotBlank(message = "消息提示不能为空")
    private String transferMsg;

}
