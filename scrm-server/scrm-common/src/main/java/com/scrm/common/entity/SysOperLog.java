package com.scrm.common.entity;

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
 * 操作日志记录
 * @author xxh
 * @since 2022-05-03
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "操作日志记录")
@TableName("sys_oper_log")
public class SysOperLog implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "模块名称")
    private String modelName;

    @ApiModelProperty(value = "方法名称")
    private String method;

    @ApiModelProperty(value = "请求方式")
    private String requestMethod;

    @ApiModelProperty(value = "操作类型")
    private String operatorType;

    @ApiModelProperty(value = "操作人员名称")
    private String operName;

    @ApiModelProperty(value = "操作人员ID")
    private String operId;

    @ApiModelProperty(value = "请求URL")
    private String operUrl;

    @ApiModelProperty(value = "主机地址")
    private String operIp;

    @ApiModelProperty(value = "操作地点")
    private String operLocation;

    @ApiModelProperty(value = "请求参数")
    private String operParam;

    @ApiModelProperty(value = "返回参数")
    private String jsonResult;

    @ApiModelProperty(value = "操作状态（0正常 1异常）")
    private Integer status;

    @ApiModelProperty(value = "错误消息")
    private String errorMsg;

    @ApiModelProperty(value = "操作时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date operTime;

    @ApiModelProperty(value = "操作服务（1: 后台管理 2:客户端 ）")
    private Integer operatorServer;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    /**
     * 操作服务: 后台管理
     */
    public static final Integer OPERATOR_SERVER_CMS = 1;

    /**
     * 操作服务: 客户端
     */
    public static final Integer OPERATOR_SERVER_WX_CP = 2;

    /**
     * 操作状态: 正常
     */
    public static final Integer STATUS_SUCCESS = 0;

    /**
     * 操作状态: 异常
     */
    public static final Integer STATUS_FAIL = 1;


}
