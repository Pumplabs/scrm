package com.scrm.common.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 企业订阅管理
 * @author ouyang
 * @since 2022-05-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业订阅管理")
@TableName(value ="sys_subscribe" , autoResultMap = true)
public class SysSubscribe implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    @ApiModelProperty(value = "id")
    private String id;

    @ApiModelProperty(value = "授权方企业id（第三方拿到的加密企业id）")
    private String corpId;

    @ApiModelProperty(value = "企业名称")
    private String corpName;

    @ApiModelProperty(value = "版本id")
    private String versionId;

    @ApiModelProperty(value = "席位")
    private Integer seat;

    @ApiModelProperty(value = "存储容量，单位GB")
    private String capacity;

    @ApiModelProperty(value = "已用席位")
    private Integer useSeat;

    @ApiModelProperty(value = "已用存储容量，单位GB")
    private String useCapacity;

    @ApiModelProperty(value = "有效期")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date validity;

    @ApiModelProperty(value = "状态 0-已过期 1-订阅中")
    private Integer status;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "更新时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;

    @ApiModelProperty(value = "配置员工id集合")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> staffIds;

    //状态：已过期
    public static final Integer OVERDUE_STATUS = 0;

    //状态：订阅中
    public static final Integer SUBSCRIBE_STATUS = 1;


}
