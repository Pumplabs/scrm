package com.scrm.server.wx.cp.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-08-02
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户-员工跟进协助人新增/修改请求参数")
public class WxCustomerStaffAssistSaveOrUpdateDTO {

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "员工extId")
    private String extStaffId;

    @ApiModelProperty(value = "客户extId")
    private String extCustomerId;

    @ApiModelProperty(value = "协助员工extId列表")
    private List<String> assistExtStaffIdList;


}
