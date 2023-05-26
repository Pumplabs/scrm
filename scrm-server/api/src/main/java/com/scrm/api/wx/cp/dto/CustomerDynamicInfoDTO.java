package com.scrm.api.wx.cp.dto;

import com.scrm.api.wx.cp.entity.MediaInfo;
import com.scrm.api.wx.cp.entity.WxTag;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;


@Data
@Accessors(chain = true)
@ApiModel("客户旅程的客户动态详细信息")
public class CustomerDynamicInfoDTO {

    @ApiModelProperty("群聊id")
    private String chatExtId;

    @ApiModelProperty("群聊名")
    private String chatName;

    @ApiModelProperty("旅程id")
    private String journeyId;

    @ApiModelProperty("旅程名")
    private String journeyName;

    @ApiModelProperty("旧的旅程阶段id")
    private String oldStageId;

    @ApiModelProperty("旧的旅程名")
    private String oldStageName;

    @ApiModelProperty("新的旅程阶段id")
    private String newStageId;

    @ApiModelProperty("新的旅程名")
    private String newStageName;

    @ApiModelProperty("标签集合")
    private List<WxTag> tags;

    @ApiModelProperty("打标签来源：" +
            "media->轨迹素材，" +
            "joinTask->参加任务宝的活动，" +
            "finishTask->完成任务宝的活动，" +
            "contact->渠道活码，" +
            "manual->人打的")
    private String tagOrigin;

    @ApiModelProperty("轨迹素材")
    private MediaInfo mediaInfo;

    @ApiModelProperty("活动id")
    private String taskId;

    @ApiModelProperty("活动名")
    private String taskName;

    @ApiModelProperty("动态id")
    private String dynamicMediaId;

    @ApiModelProperty("跟进id")
    private String followId;
    
    @ApiModelProperty("跟进内容")
    private String followContent;
}
