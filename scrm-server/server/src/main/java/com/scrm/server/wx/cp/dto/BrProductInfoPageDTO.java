package com.scrm.server.wx.cp.dto;

import com.scrm.server.wx.cp.entity.BrProductInfo;
import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@ApiModel(value = "产品详情分页请求参数")
@Accessors(chain = true)
public class BrProductInfoPageDTO extends BasePageDTO{

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "产品分类")
    private String productTypeId;

    @ApiModelProperty(value = "产品名称")
    private String name;

    @ApiModelProperty(value = "产品状态 1:草稿 2:销售中 3:已下架")
    private Integer status;


}

