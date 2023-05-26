package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxCustomerInfo;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2021-12-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户详情信息结果集")
public class WxCustomerInfoVO extends WxCustomerInfo{


}
