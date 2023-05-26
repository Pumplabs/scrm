package com.scrm.server.wx.cp.entity;

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
 * 产品分类
 *
 * @author xxh
 * @since 2022-07-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "产品信息")
@TableName(value = "br_product_info", autoResultMap = true)
public class BrProductInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "产品名称")
    private String name;

    @ApiModelProperty(value = "产品状态 1:草稿 2:销售中 3:已下架")
    private Integer status;

    @ApiModelProperty(value = "产品分类ID")
    private String productTypeId;

    @ApiModelProperty(value = "产品图册")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<BrProductInfoAtlas> atlas;

    @ApiModelProperty(value = "价格")
    private String price;

    @ApiModelProperty(value = "产品简介")
    private String profile;

    @ApiModelProperty(value = "产品描述")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<Object> description;

    @ApiModelProperty(value = "产品编码")
    private String code;

    @ApiModelProperty(value = "附加属性")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<BrProductInfoImbue> imbue;

    @ApiModelProperty(value = "浏览次数")
    private Long views;

    @ApiModelProperty(value = "编辑员工id")
    private String editor;

    @ApiModelProperty(value = "创建员工id")
    private String creator;

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


}
