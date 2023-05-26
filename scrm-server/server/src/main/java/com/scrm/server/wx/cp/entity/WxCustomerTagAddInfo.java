package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 企业微信客户-批量添加标签明细
 * @author xxh
 * @since 2022-04-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户-批量添加标签明细")
@TableName("wx_customer_tag_add_info")
public class WxCustomerTagAddInfo implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "标签id")
    private String tagId;

    @ApiModelProperty(value = "客户id")
    private String customerId;

    @ApiModelProperty(value = "是否成功")
    private Boolean isSuccessful;

    @ApiModelProperty(value = "失败类型")
    private String failType;

    @ApiModelProperty(value = "失败原因")
    private String failMsg;

    @ApiModelProperty(value = "失败日志")
    private String failLog;

    @ApiModelProperty(value = "请求参数")
    private String param;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "创建员工id")
    private String creator;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;


}
