package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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
 * @since 2022-05-15
 */
@Data
@ApiModel(value = "素材统计表条件查询请求参数")
@Accessors(chain = true)
public class BrMediaCountQueryDTO {

    @ApiModelProperty("必填，企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("必填，开始统计的时间")
    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date startTime;

    @ApiModelProperty("必填，展示多少条")
    @NotNull
    private Integer showCount;

    @ApiModelProperty("必填，类型，1->浏览，2->发送")
    @NotNull
    private Integer type;

    public static final Integer TYPE_LOOK = 1;

    public static final Integer TYPE_SEND = 2;
}
