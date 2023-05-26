package com.scrm.server.wx.cp.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.server.wx.cp.entity.BrProductInfoAtlas;
import com.scrm.server.wx.cp.entity.BrProductInfoImbue;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "产品信息修改请求参数")
public class BrProductInfoUpdateDTO {

    @ApiModelProperty(value = "主键",required = true)
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "产品名称(限20字)", required = true)
    @NotBlank(message = "产品名称不能为空")
    @Length(max = 20, message = "产品名称不能超过20字")
    private String name;

    @ApiModelProperty(value = "产品状态 1:草稿 2:销售中 3:已下架", required = true)
    @NotNull(message = "产品状态不能为空")
    private Integer status;

    @ApiModelProperty(value = "产品分类ID", required = true)
    @NotBlank(message = "产品分类不能为空")
    private String productTypeId;

    @ApiModelProperty(value = "产品编码")
    private String code;

    @ApiModelProperty(value = "产品图册")
    private List<BrProductInfoAtlas> atlas;

    @ApiModelProperty(value = "价格")
    private String price;

    @ApiModelProperty(value = "产品简介(限500字)")
    @Length(max = 500, message = "产品简介不能超过500字")
    private String profile;

    @ApiModelProperty(value = "产品描述")
    private List<Object> description;

    @ApiModelProperty(value = "附加属性")
    private List<BrProductInfoImbue> imbue;

    @ApiModelProperty(value = "浏览次数")
    private Long views;
}
