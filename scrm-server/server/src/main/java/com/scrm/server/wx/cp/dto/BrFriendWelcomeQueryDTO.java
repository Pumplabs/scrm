package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-04-23
 */
@Data
@ApiModel(value = "好友欢迎语条件查询请求参数")
@Accessors(chain = true)
public class BrFriendWelcomeQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

}
