package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableLogic;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 通用配置
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "通用配置")
@TableName("br_common_conf")
public class BrCommonConf implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    @ApiModelProperty(value = "ID")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "创建员工id")
    private String creator;

    @ApiModelProperty(value = "编辑员工id")
    private String editor;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "颜色")
    private String color;

    @ApiModelProperty(value = "状态 1:系统默认 0:非系统默认")
    private Boolean isSystem;

    @ApiModelProperty(value = "编码")
    private Integer code;

    @ApiModelProperty(value = "类型编码")
    private String typeCode;

    @ApiModelProperty(value = "所属分组id")
    private String groupId;

    @ApiModelProperty(value = "排序")
    private Integer sort;

    /**
     * 类型编码，商机阶段
     */
    public static final String OPPORTUNITY_STAGE = "OPPORTUNITY_STAGE";

    /**
     * 类型编码，商机输单原因
     */
    public static final String OPPORTUNITY_FAIL_REASON = "OPPORTUNITY_FAIL_REASON";

}
