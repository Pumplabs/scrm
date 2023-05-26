package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
@Accessors(chain = true)
@ApiModel(value = "客户离职继承列表请求参数")
public class WxResignedStaffCustomerInfoDTO  extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotBlank(message = "请输入外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "成员离职开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date dimissionBeginTime;

    @ApiModelProperty(value = "成员离职结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date dimissionEndTime;

}
