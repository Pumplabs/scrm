package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableId;
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
 * 企微应用宝-渠道码
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-渠道码")
@TableName("wx_fission_contact")
public class WxFissionContact implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "任务id")
    private String taskId;

    @ApiModelProperty("是否是任务默认的海报，1->是，0->不是")
    private Boolean hasSystem;

    @ApiModelProperty(value = "客户id")
    private String extCustomerId;

    @ApiModelProperty(value = "渠道码配置id")
    private String configId;

    @ApiModelProperty(value = "渠道码的state")
    private String state;

    @ApiModelProperty(value = "渠道码的二维码")
    private String qrCode;

    @ApiModelProperty(value = "是否是本地活动裂变的新客户，1->是，0->不是")
    private Boolean hasNewCustomer;

    @ApiModelProperty(value = "海报文件id，wx_temp_file的id")
    private String posterFileId;

    @ApiModelProperty(value = "生成海报文件时任务的海报的文件id，wx_temp_file的id")
    private String theLastPosterFileId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "更新时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;


}
