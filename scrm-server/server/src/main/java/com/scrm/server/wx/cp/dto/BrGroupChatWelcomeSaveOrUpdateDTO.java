package com.scrm.server.wx.cp.dto;

import java.util.List;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-04-24
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "入群欢迎语新增/修改DTO")
public class BrGroupChatWelcomeSaveOrUpdateDTO {

    @ApiModelProperty(value = "主键")
    private String id;

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "是否通知群主", required = true)
    @NotNull(message = "是否通知群主不能为空")
    private Boolean isNoticeOwner;

    @ApiModelProperty(value = "消息内容")
    private WxMsgDTO msg;

    @ApiModelProperty(value = "群聊extIds")
    private List<String> groupChatExtIds;


}
