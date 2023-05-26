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
 * 系统版本表
 * @author ouyang
 * @since 2022-05-03
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "系统版本表")
@TableName(value = "sys_service_version", autoResultMap = true)
public class SysServiceVersion implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    @ApiModelProperty(value = "'ID'")
    private String id;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "基础席位")
    private Integer seat;

    @ApiModelProperty(value = "存储容量，单位GB")
    private String capacity;

    @ApiModelProperty(value = "描述")
    private String des;

    @ApiModelProperty(value = "创建人")
    private String creator;

    @ApiModelProperty(value = "更新人")
    private String editor;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "修改时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;

    @ApiModelProperty(value = "关联菜单id集合")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> menuIds;

}
