package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.vo.AppInfoVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 素材管理
 * @author xxh
 * @since 2022-03-14
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "素材管理")
@TableName(value = "br_media_info", autoResultMap = true)
public class MediaInfo implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    private String extCorpId;

    @ApiModelProperty(value = "类型， 1-> 海报， 2->图片， 3->文本， 4->小程序， 5-> 文章， 6->视频， 7->链接， 8->文件")
    private Integer type;

    @ApiModelProperty("文件id")
    private String fileId;

    @ApiModelProperty(value = "标签，最长20")
    private String title;

    @ApiModelProperty(value = "描述，最长150")
    private String description;

    @ApiModelProperty(value = "文本内容，最长500")
    private String content;

    @ApiModelProperty(value = "概要，最长35")
    private String summary;
    
    @ApiModelProperty(value = "视频封面id")
    private String videoSnapshotFileId;

    @ApiModelProperty(value = "链接")
    private String link;

    @ApiModelProperty(value = "富文本文章内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<Object> richText;

    @ApiModelProperty(value = "小程序的app的各种信息")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private AppInfoVO appInfo;

    @ApiModelProperty(value = "素材标签集合")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> mediaTagList;

    @ApiModelProperty(value = "微信标签集合")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> wxTagList;

    @ApiModelProperty(value = "是否动态通知")
    private Boolean hasInform;

    @ApiModelProperty("是否被编辑过了，每次编辑删除生成新的id，这个让旧的选了素材的还可以关联上")
    private Boolean hasUpdate;

    @ApiModelProperty(value = "创建者id")
    private String creatorExtId;

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


}
