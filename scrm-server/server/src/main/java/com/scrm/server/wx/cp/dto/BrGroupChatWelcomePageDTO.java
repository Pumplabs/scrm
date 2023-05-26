package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-04-24
 */
@Data
@ApiModel(value = "入群欢迎语分页请求参数")
@Accessors(chain = true)
public class BrGroupChatWelcomePageDTO extends BasePageDTO {

    @ApiModelProperty(value = "企业id", required = true)
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "文本内容")
    private String content;

}

