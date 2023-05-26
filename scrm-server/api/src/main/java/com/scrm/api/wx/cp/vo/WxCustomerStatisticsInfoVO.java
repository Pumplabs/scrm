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
 * @date 2022/6/6 20:16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户统计信息")
public class WxCustomerStatisticsInfoVO {

    @ApiModelProperty(value = "日期" )
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date day;

    @ApiModelProperty(value = "流失数" )
    private long lossTotal;

    @ApiModelProperty(value = "新增数" )
    private long saveTotal;

}
