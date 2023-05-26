package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.MediaTag;
import com.scrm.api.wx.cp.entity.MediaTagGroup;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2022-03-13
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业微信标签组管理结果集")
public class MediaTagGroupVO extends MediaTagGroup{

    private List<MediaTag> tags;

}
