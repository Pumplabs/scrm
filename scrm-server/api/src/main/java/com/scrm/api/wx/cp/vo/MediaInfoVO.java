package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.MediaInfo;
import com.scrm.api.wx.cp.entity.MediaTag;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxTag;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2022-03-14
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "素材管理结果集")
public class MediaInfoVO extends MediaInfo{

    @ApiModelProperty("创建者信息")
    private Staff creatorInfo;

    @ApiModelProperty("企微那边的素材id")
    private String mediaId;

    @ApiModelProperty("文件名后缀")
    private String mediaSuf;

    @ApiModelProperty("请求这个轨迹素材的url")
    private String requestUrl;

    @ApiModelProperty("文件大小")
    private Integer fileSize;

    @ApiModelProperty("微信标签翻译")
    private List<WxTag> wxTagDetailList;

    @ApiModelProperty("素材标签翻译")
    private List<MediaTag> mediaTagDetailList;

    @ApiModelProperty("发送次数")
    private Integer sendNum;

    @ApiModelProperty("浏览次数")
    private Integer lookNum;
}
