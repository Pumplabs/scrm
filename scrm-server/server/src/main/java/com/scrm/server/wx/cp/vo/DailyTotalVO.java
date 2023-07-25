package com.scrm.server.wx.cp.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgAttachmentDTO;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.entity.BrCommonConf;
import com.scrm.server.wx.cp.entity.BrOpportunity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "每天新增统计结果")
public class DailyTotalVO {
    @ApiModelProperty(value = "统计日期")
    private String day;

    @ApiModelProperty("商机数量")
    private Long saveTotal;
}
