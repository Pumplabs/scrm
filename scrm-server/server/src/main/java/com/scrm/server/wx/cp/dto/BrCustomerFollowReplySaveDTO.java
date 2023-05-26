package com.scrm.server.wx.cp.dto;

import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author xxh
 * @since 2022-05-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户跟进回复表新增DTO")
public class BrCustomerFollowReplySaveDTO {

    
    @ApiModelProperty(value = "企业id")
    @NotBlank
    private String extCorpId;

    @ApiModelProperty(value = "跟进id")
    @NotBlank
    private String followId;

    @ApiModelProperty(value = "回复内容")
    @NotNull
    private WxMsgDTO content;

    @ApiModelProperty("回复id")
    private String replyId;

    @ApiModelProperty("是否回复跟进，1->回复跟进，0->回复回复")
    @NotNull(message = "请选择是回复跟进还是回复回复")
    private Boolean hasReplyFollow;
}
