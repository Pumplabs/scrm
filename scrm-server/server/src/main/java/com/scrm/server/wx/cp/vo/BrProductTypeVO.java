package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrProductType;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "产品分类结果集")
public class BrProductTypeVO extends BrProductType{

    @ApiModelProperty(value = "产品数量")
    private long productNum;

}
