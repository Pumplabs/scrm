package com.scrm.api.wx.cp.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @author xuxh
 * @date 2022/6/7 11:13
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群首页统计信息")
public class WxGroupChatStatisticsVO {

    @ApiModelProperty(value = "日期" )
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date day;

    @ApiModelProperty(value = "总人数")
    private long totalMember;

    @ApiModelProperty(value = "客户总数")
    private long customerNum;

    @ApiModelProperty(value = "入群人数")
    private long joinMemberNum;

    @ApiModelProperty(value = "退群人数")
    private long quitMemberNum;
}
