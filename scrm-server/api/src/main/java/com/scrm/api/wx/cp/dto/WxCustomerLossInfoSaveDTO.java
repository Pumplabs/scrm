package com.scrm.api.wx.cp.dto;

import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;


/**
 * @author xxh
 * @since 2022-03-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户流失情况信息新增DTO" )
public class WxCustomerLossInfoSaveDTO {

    @ApiModelProperty(value = "外部企业ID" )
    private String extCorpId;

    @ApiModelProperty(value = "客户ID" )
    private String customerId;

    private String extCustomerId;

    @ApiModelProperty(value = "客户员工跟进ID")
    private String customerStaffId;

    @ApiModelProperty(value = "员工ID" )
    private String staffId;

    @ApiModelProperty(value = "员工extId" )
    private String staffExtId;

    @ApiModelProperty(value = "类型 1:客户删除员工 2:员工删除客户" )
    private Integer type;

    @ApiModelProperty(value = "客户标签ID列表")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> tagExtIds;

    @ApiModelProperty(value = "所属客户旅程阶段ID列表(仅客户被删除的时候用)")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> journeyStageIds;

    @ApiModelProperty(value = "删除时间" )
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss" )
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date deleteTime;

    @ApiModelProperty(value = "添加时间" )
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss" )
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date addTime;

    @ApiModelProperty(value = "创建时间" )
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss" )
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date createTime;


    @ApiModelProperty(value = "客户是因在职继承自动被转接成员删除",hidden = true)
    private Boolean deleteByTransfer;


}
