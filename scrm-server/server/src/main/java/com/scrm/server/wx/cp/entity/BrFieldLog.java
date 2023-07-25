package com.scrm.server.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.server.wx.cp.dto.BrFieldLogInfoDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 字段变化记录
 * @author ouyang
 * @since 2022-06-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "字段变化记录")
@TableName(value = "br_field_log", autoResultMap = true)
public class BrFieldLog implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "数据库表名")
    private String tableName;

    @ApiModelProperty(value = "操作类型 1:字段更新 2:添加跟进 3:任务完成 4:任务逾期 5:分配线索 6:回收线索 7:关闭线索 8:激活线索 9:退回线索 10:创建")
    private Integer method;

    @ApiModelProperty(value = "操作时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date operTime;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "操作人ID")
    private String operId;

    @ApiModelProperty(value = "旧值")
    private String oldValue;

    @ApiModelProperty(value = "新值")
    private String newValue;

    @ApiModelProperty(value = "字段名称")
    private String fieldName;

    @ApiModelProperty(value = "数据id")
    private String dataId;

    @ApiModelProperty(value = "详情")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private BrFieldLogInfoDTO info;

    //商机表名
    public static final String OPPORTUNITY_TABLE_NAME = "br_opportunity";

    //线索表名
    public static final String CLUE_TABLE_NAME = "br_clue";

    //跟进表名
    public static final String FOLLOW_TABLE_NAME = "br_customer_follow";

    //跟进任务表名
    public static final String FOLLOW_TASK_TABLE_NAME = "br_follow_task";

    /**
     *  1:字段更新 2:添加跟进 3:任务完成 4:任务逾期
     */
    public static final Integer FIELD_UPDATE = 1;
    public static final Integer ADD_FOLLOW = 2;
    public static final Integer TASK_DONE = 3;
    public static final Integer TASK_OVERDUE = 4;
    public static final Integer FOLLOW_CLUE = 5;
    public static final Integer RECOVER_CLUE = 6;
    public static final Integer CLOSE_CLUE = 7;
    public static final Integer OPEN_CLUE = 8;
    public static final Integer BACK_CLUE = 9;
    public static final Integer SAVE_NEW = 10;

}
