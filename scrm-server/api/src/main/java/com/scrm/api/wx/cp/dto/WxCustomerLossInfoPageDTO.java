package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * @author xxh
 * @since 2022-03-26
 */
@Data
@ApiModel(value = "客户流失情况信息分页请求参数")
@Accessors(chain = true)
public class WxCustomerLossInfoPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("删除开始时间（yyyy-MM-dd ）")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deleteBeginTime;

    @ApiModelProperty("删除结束时间（yyyy-MM-dd ）")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deleteEndTime;

    @ApiModelProperty(value = "客户昵称")
    private String customerName;

    @ApiModelProperty(value = "类型 1:客户删除员工 2:员工删除客户",required = true)
    @NotNull(message = "类型不能为空")
    private Integer type;


}

