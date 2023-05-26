package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxTag;
import com.scrm.api.wx.cp.entity.WxTagGroup;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * @author xxh
 * @since 2021-12-29
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信标签组管理结果集")
public class WxTagGroupVO extends WxTagGroup{

    private List<WxTag> tags;

}
