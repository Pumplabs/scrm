package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author xxh
 * @since 2022-01-19
 */
@Data
@ApiModel(value = "客户群聊成员分页请求参数")
@Accessors(chain = true)
public class WxGroupChatMemberPageDTO extends BasePageDTO {


    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "群聊id")
    private String extChatId;

    @ApiModelProperty(value = "成员名称")
    private String memberName;

    @ApiModelProperty(value = "群成员类型 1 - 企业成员 2 - 外部联系人")
    private Integer type;

    @ApiModelProperty(value = "入群时间-开始时间（时间戳）")
    private Long joinTimeBegin;

    @ApiModelProperty(value = "入群时间-结束时间（时间戳）")
    private Long joinTimeEnd;

    @ApiModelProperty(value = "入群方式 1 - 由群成员邀请入群（直接邀请入群）2 - 由群成员邀请入群（通过邀请链接入群）3 - 通过扫描群二维码入群")
    private Integer joinScene;

}

