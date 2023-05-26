package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-06-27
 */
@Data
@ApiModel(value = "待分配群聊DTO")
@Accessors(chain = true)
public class WxResignedStaffGroupChatWaitPageDTO extends BasePageDTO{

    @ApiModelProperty(value = "企业id",required = true)
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "原群主extId",required = true)
    @NotBlank(message = "原群主extId不能为空")
    private String handoverStaffExtId;


}

