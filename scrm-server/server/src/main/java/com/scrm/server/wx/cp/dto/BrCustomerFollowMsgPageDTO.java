package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
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
@ApiModel(value = "客户跟进的消息分页请求参数")
@Accessors(chain = true)
public class BrCustomerFollowMsgPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("看回复还是看跟进，true->回复， false->跟进")
    @NotNull
    private Boolean hasReply;
}

