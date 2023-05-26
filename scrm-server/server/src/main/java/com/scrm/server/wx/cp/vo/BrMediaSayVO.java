package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.MediaTag;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrMediaSay;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2022-05-10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业话术结果集")
public class BrMediaSayVO extends BrMediaSay{

    @ApiModelProperty("创建者")
    private Staff creator;

    @ApiModelProperty("标签集合")
    private List<MediaTag> tagList;

    @ApiModelProperty("消息的")
    private String mediaId;
}
