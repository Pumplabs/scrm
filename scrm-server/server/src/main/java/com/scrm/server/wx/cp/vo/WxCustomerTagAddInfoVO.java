package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.WxCustomerTagAddInfo;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-04-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户-批量添加标签明细结果集")
public class WxCustomerTagAddInfoVO extends WxCustomerTagAddInfo{


}
