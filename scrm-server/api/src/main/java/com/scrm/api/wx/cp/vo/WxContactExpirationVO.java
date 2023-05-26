package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxContactExpiration;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "渠道码，过期时间表结果集")
public class WxContactExpirationVO extends WxContactExpiration{


}
