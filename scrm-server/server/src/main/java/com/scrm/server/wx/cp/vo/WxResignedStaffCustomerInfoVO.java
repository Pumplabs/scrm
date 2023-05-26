package com.scrm.server.wx.cp.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.vo.StaffVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Accessors(chain = true)
@ApiModel(value = "离职继承列表信息VO")
public class WxResignedStaffCustomerInfoVO {

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "原添加员工信息")
    private StaffVO handoverStaff;

    @ApiModelProperty(value = "原添加员工extId")
    private String handoverStaffExtId;

    @ApiModelProperty("待分配客户数")
    private Integer waitAssignCustomerNum;

    @ApiModelProperty(value = "成员离职时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date dimissionTime;


}
