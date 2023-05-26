package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
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
 * 企业微信标签管理
 *
 * @author xxh
 * @since 2021-12-29
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信标签管理")
@TableName("wx_tag")
public class WxTag implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "'ID'")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "外部标签ID")
    private String extId;

    @ApiModelProperty(value = "外部标签组ID")
    private String extGroupId;

    @ApiModelProperty(value = "标签名称")
    private String name;

    @ApiModelProperty(value = "标签组ID")
    private String groupId;

    @ApiModelProperty(value = "标签组名称")
    private String groupName;

    @ApiModelProperty(value = "标签排序值，值大的在前")
    @TableField("`order`")
    private Long order;

    @ApiModelProperty(value = "标签组类型, 1-企微后台设置, 2-第三方设置")
    private Integer type;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

//    @ApiModelProperty(value = "'删除时间'")
//    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
//    @TableLogic
//    private Date deletedAt;

    @TableLogic(value = "0", delval = "null")
    private Boolean hasDelete;

    /**
     * 所打标签类型: 企微后台设置
     */
    public static final Integer TYPE_CP_BACKGROUND = 1;

    /**
     * 所打标签类型: 第三方设置
     */
    public static final Integer TYPE_THIRD_PARTY = 2;
}
