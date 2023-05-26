package com.scrm.server.wx.cp.entity;

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
 * 异步任务的错误信息记录
 * @author xxh
 * @since 2022-05-28
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "异步任务的错误信息记录")
@TableName("br_async_error_info")
public class BrAsyncErrorInfo implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "参数")
    private String params;

    @ApiModelProperty(value = "类型")
    private String type;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "错误堆栈信息")
    private String errorMsg;

    public static final String TYPE_EDIT_TAG = "editTag";
}
