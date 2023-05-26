package com.scrm.api.wx.cp.entity;

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
 * @author xxh
 * @since 2022-03-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "系统开关" )
@TableName("sys_switch" )
public class SysSwitch implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "'ID'" )
    @TableId
    private String id;

    @ApiModelProperty(value = "类型" )
    private String code;

    @ApiModelProperty(value = "开关状态 0:关 1:开" )
    private Integer status;

    @ApiModelProperty(value = "创建时间" )
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss" )
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date createTime;

    @ApiModelProperty(value = "修改时间" )
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss" )
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date updateTime;

    @ApiModelProperty(value = "描述" )
    private String details;

    @ApiModelProperty(value = "外部企业ID" )
    private String extCorpId;

    @ApiModelProperty(value = "操作人" )
    private String editor;


    /**
     * 开关状态: 开
     */
    public static final Integer STATUS_OPEN = 1;


    /**
     * 开关状态: 关
     */
    public static final Integer STATUS_CLOSE = 0;


}
