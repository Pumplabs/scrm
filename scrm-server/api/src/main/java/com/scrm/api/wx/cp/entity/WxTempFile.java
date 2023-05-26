package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 微信临时素材表
 * @author xxh
 * @since 2022-01-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "微信临时素材表")
@TableName(value = "wx_temp_file", autoResultMap = true)
public class WxTempFile implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "公司id")
    private String extCorpId;

    @ApiModelProperty(value = "文件全路径")
    private String filePath;

    @ApiModelProperty(value = "文件预览路径")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> previewPathList;
    
    @ApiModelProperty(value = "初始文件名")
    private String fileName;

    @ApiModelProperty(value = "类型： 1->图片")
    private String type;

    @ApiModelProperty(value = "wx的id")
    private String mediaId;

    @ApiModelProperty("是否上传到wx，1->是，0->否")
    private Boolean hasUploadToWx;

    @ApiModelProperty("文件大小")
    private Integer size;

    @ApiModelProperty(value = "最近一次传到wx的时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date wxCreatedAt;

    @ApiModelProperty(value = "创建者")
    private String creatorExtId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @TableLogic
    private Date deletedAt;
}
