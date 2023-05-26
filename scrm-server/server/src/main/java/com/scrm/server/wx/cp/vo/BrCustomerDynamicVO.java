package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.server.wx.cp.entity.BrCustomerDynamic;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author xxh
 * @since 2022-05-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户动态结果集")
public class BrCustomerDynamicVO extends BrCustomerDynamic{

    @ApiModelProperty("看了轨迹素材多少秒")
    private Integer mediaSeconds;

    @ApiModelProperty("客户信息")
    private WxCustomer wxCustomer;
    
}
