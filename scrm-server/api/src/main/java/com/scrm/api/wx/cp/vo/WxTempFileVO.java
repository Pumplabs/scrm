package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxTempFile;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-01-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "微信临时素材表结果集")
public class WxTempFileVO extends WxTempFile{


}
