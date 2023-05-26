package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.vo.MediaInfoVO;
import com.scrm.server.wx.cp.entity.BrMediaSayGroup;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author xxh
 * @since 2022-05-15
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "素材统计表结果集")
public class BrMediaCountVO {

    private String id;

    @ApiModelProperty("类型，1->素材，2->话术")
    private Integer type;

    @ApiModelProperty("轨迹素材的信息")
    private MediaInfoVO mediaInfo;

    @ApiModelProperty("话术信息")
    private BrMediaSayVO mediaSay;

    @ApiModelProperty("话术分组")
    private BrMediaSayGroup mediaSayGroup;

    @ApiModelProperty("发送/浏览的次数")
    private Integer count;
}
