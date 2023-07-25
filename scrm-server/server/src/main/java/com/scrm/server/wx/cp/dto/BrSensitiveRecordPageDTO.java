package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@ApiModel("敏感词记录查询条件")
public class BrSensitiveRecordPageDTO extends BasePageDTO {

    @ApiModelProperty("企业id")
    private String extCorpId;

    @ApiModelProperty("敏感词")
    private String keyword;

    @ApiModelProperty("类型: 1->包含敏感词，2->发红包，3->发手机号， 4->发邮件地址")
    private Integer type;

    @ApiModelProperty("发送员工extId")
    private String extStaffId;

    @ApiModelProperty("发送客户extId")
    private String extCustomerId;

    @ApiModelProperty("发送时间-开始")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date start;

    @ApiModelProperty("发送时间-结束")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date end;
}
