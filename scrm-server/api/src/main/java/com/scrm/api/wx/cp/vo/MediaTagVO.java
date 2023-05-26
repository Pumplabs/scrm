package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.MediaTag;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-13
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业微信标签管理结果集")
public class MediaTagVO extends MediaTag{


}
