package com.scrm.api.wx.cp.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/7 18:14
 * @description：渠道活码统计详情VO
 **/
@ApiModel("渠道活码统计详情VO")
@Data
@Accessors(chain = true)
public class ContactWayCountDetailVO {

    @ApiModelProperty("客户信息")
    private WxCustomer customer;

    @ApiModelProperty("员工信息")
    private Staff staff;

    @ApiModelProperty("是否删除")
    private Boolean hasDelete;

    @ApiModelProperty("添加时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;
}
