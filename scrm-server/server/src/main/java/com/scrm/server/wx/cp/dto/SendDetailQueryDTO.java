package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@ApiModel(value = "sop发送详情查询请求参数")
@Accessors(chain = true)
public class SendDetailQueryDTO {

    @ApiModelProperty("规则id")
    @NotBlank(message = "规则id不能为空")
    private String ruleId;

    @ApiModelProperty(value = "执行时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date executeAt;

}
