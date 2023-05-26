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
 * 素材统计表
 * @author xxh
 * @since 2022-05-15
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "素材统计表")
@TableName("br_media_count")
public class BrMediaCount implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    private String extCorpId;

    @ApiModelProperty(value = "类型，1->素材，2->话术")
    private Integer type;

    @ApiModelProperty(value = "类型的id")
    private String typeId;

    @ApiModelProperty(value = "发送的次数")
    private Integer sendCount;

    @ApiModelProperty(value = "日期")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date date;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @ApiModelProperty(value = "更新时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;


    /**
     * 轨迹素材
     */
    public static final int MEDIA_INFO = 1;

    /**
     * 话术
     */
    public static final int MEDIA_SAY = 2;
}
