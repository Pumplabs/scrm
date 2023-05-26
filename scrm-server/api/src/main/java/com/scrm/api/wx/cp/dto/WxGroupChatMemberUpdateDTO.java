package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-01-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊成员修改请求参数")
public class WxGroupChatMemberUpdateDTO {

    @ApiModelProperty(value = "'ID'")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "群聊id")
    private String extChatId;

    @ApiModelProperty(value = "群成员id")
    private String userid;

    @ApiModelProperty(value = "群成员类型 1 - 企业成员 2 - 外部联系人")
    private Integer type;

    @ApiModelProperty(value = "入群时间")
    private Long joinTime;

    @ApiModelProperty(value = "入群方式 1 - 由群成员邀请入群（直接邀请入群）2 - 由群成员邀请入群（通过邀请链接入群）3 - 通过扫描群二维码入群")
    private Integer joinScene;

    @ApiModelProperty(value = "邀请者。目前仅当是由本企业内部成员邀请入群时会返回该值")
    private String invitor;

    @ApiModelProperty(value = "外部联系人在微信开放平台的唯一身份标识（微信unionid）")
    private String unionid;

}
