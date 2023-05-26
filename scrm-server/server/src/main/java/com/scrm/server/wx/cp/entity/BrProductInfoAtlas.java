package com.scrm.server.wx.cp.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author xuxh
 * @date 2022/7/20 17:02
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "产品分类-图册")
public class BrProductInfoAtlas {

    @ApiModelProperty(value = "ID")
    private String id;

    @ApiModelProperty(value = "名称")
    private String name;
}

