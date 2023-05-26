package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@Accessors(chain = true)
@ApiModel(value = "离职继承待移交客户分页请求参数")
public class WxWaitResignedTransferCustomerPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "员工extId", required = true)
    @NotBlank(message = "员工extId不能为空")
    private String staffExtId;

    @ApiModelProperty(value = "成员离职时间",required = true)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @NotNull(message = "成员离职时间不能为空")
    private Date dimissionTime;

    @ApiModelProperty(value = "关键字")
    private String keyword;
}

