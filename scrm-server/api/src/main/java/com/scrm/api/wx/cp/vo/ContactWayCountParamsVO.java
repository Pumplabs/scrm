package com.scrm.api.wx.cp.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/7 15:43
 * @description：渠道活码统计VO
 **/
@Data
@ApiModel("渠道活码统计VO")
public class ContactWayCountParamsVO {

    @ApiModelProperty("企业id，必填")
    @NotBlank
    private String extCorpId;

    @ApiModelProperty("渠道码id，必填")
    @NotBlank
    private String contactWayId;

    @ApiModelProperty("渠道码的state，必填")
    @NotBlank
    private String state;

    @ApiModelProperty("开始事件，格式yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date start;

    @ApiModelProperty("结束事件，格式yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date end;

}
