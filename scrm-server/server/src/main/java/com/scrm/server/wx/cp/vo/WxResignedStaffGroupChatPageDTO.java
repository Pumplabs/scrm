package com.scrm.server.wx.cp.vo;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author xuxh
 * @date 2022/7/4 15:59
 */
@Data
@ApiModel(value = "群聊离职继承DTO")
@Accessors(chain = true)
public class WxResignedStaffGroupChatPageDTO  extends BasePageDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

}
