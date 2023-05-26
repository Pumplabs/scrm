package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @author xxh
 * @since 2022-03-05
 */
@Data
@ApiModel(value = "员工在职转接记录分页请求参数")
@Accessors(chain = true)
public class WxStaffTransferInfoPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "开始时间 yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date beginTime;

    @ApiModelProperty(value = "结束时间 yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date endTime;

    @ApiModelProperty(value = "关键字")
    private String keyword;

    @ApiModelProperty(value = "接替状态， 1-接替完毕 2-等待接替 3-客户拒绝 4-接替成员客户达到上限 5-无接替记录")
    private Integer status;

    @ApiModelProperty(value = "类型：1:在职转接 2:离职继承", hidden = true)
    private Integer type;

    @ApiModelProperty(value = "员工ID")
    private String staffId;

}

