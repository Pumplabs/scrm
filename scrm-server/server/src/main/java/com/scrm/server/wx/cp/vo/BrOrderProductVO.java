package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrOrderProduct;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-07-25
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "订单-产品关联结果集")
public class BrOrderProductVO extends BrOrderProduct{

    @ApiModelProperty(value = "产品信息")
    private BrProductInfoVO productInfo;
}
