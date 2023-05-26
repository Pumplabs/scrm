package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxTag;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2021-12-29
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信标签管理结果集")
public class WxTagVO extends WxTag{


}
