package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "sop修改发送状态请求参数")
public class BrSopUpdateSendStatusDTO {

    @ApiModelProperty(value = "规则id")
    @NotBlank(message = "规则id不能为空")
    private String ruleId;

    @ApiModelProperty(value = "员工id")
    @NotBlank(message = "员工id不能为空")
    private String staffId;

    @ApiModelProperty(value = "jobId")
    @NotBlank(message = "jobid不能为空")
    private String jobId;

    @ApiModelProperty(value = "发送状态：0-未发送 1-已发送")
    @NotNull(message = "状态不能为空")
    private Integer sendStatus;

    @ApiModelProperty(value = "规则执行时间")
    @NotNull(message = "规则执行时间不能为空")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date executeAt;

}
