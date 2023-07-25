package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * 客户标签
 *
 * @author xxh
 * @since 2022-01-02
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户标签")
@TableName("wx_customer_staff_tag")
public class WxCustomerStaffTag implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "客户extId")
    private String extCustomerId;

    @ApiModelProperty(value = "员工extId")
    private String extStaffId;

    @ApiModelProperty(value = "标签ID")
    private String extTagId;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "'删除时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

    @TableLogic(value = "0", delval = "null")
    private Boolean hasDelete;
}
