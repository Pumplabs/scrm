package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;


@Data
@ApiModel(value = "客户群成员导出DTO")
@Accessors(chain = true)
public class WxGroupChatMemberExportDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "群聊id", required = true)
    @NotBlank(message = "群聊ID不能为空")
    private String extChatId;

    @ApiModelProperty(value = "群成员类型 1 - 企业成员 2 - 外部联系人")
    private Integer type;

    @ApiModelProperty(value = "用户id")
    private String userId;

    @ApiModelProperty(value = "入群时间-开始时间（时间戳）")
    private Long joinTimeBegin;

    @ApiModelProperty(value = "入群时间-结束时间（时间戳）")
    private Long joinTimeEnd;

    @ApiModelProperty(value = "入群方式 1 - 由群成员邀请入群（直接邀请入群）2 - 由群成员邀请入群（通过邀请链接入群）3 - 通过扫描群二维码入群")
    private Integer joinScene;

    @ApiModelProperty(value = "成员名称")
    private String memberName;
}
