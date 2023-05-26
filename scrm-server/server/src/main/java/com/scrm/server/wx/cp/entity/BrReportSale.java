package com.scrm.server.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.server.wx.cp.dto.EverydayCountResDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 每日统计的报表
 * @author xxh
 * @since 2022-08-01
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "每日统计的报表")
@TableName(value = "br_report_sale", autoResultMap = true)
public class BrReportSale implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    private String extCorpId;

    @ApiModelProperty(value = "统计数据")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<EverydayCountResDTO> countData;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;


}
