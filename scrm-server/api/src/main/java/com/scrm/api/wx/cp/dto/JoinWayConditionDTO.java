package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;

/**
 * @author ：ouyang
 * @date ：Created in 2023/5/24 15:43
 * @description：群活码统计DTO
 **/
@Data
@Accessors(chain = true)
@ApiModel("群活码统计DTO")
public class JoinWayConditionDTO {

    @ApiModelProperty("企业id，必填")
    @NotBlank
    private String extCorpId;

    @ApiModelProperty("群活码id，必填")
    @NotBlank
    private String joinWayId;

    @ApiModelProperty("群extId")
    private List<String> chatExtids;

    @ApiModelProperty("群活码的state")
    private String state;

    @ApiModelProperty(value = "入群时间-开始时间（时间戳）")
    private Long joinStart;

    @ApiModelProperty(value = "入群时间-结束时间（时间戳）")
    private Long joinEnd;

    @ApiModelProperty(value = "退群时间-开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date quitStart;

    @ApiModelProperty(value = "退群时间-结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date quitEnd;
}
