package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author xuxh
 * @date 2022/5/17 16:29
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "待移交群聊分页请求参数")
public class WxWaitTransferGroupChatPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "员工ID", required = true)
    @NotBlank(message = "员工ID不能为空")
    private String staffId;

    @ApiModelProperty(value = "关键字")
    private String keyword;


    //类型：在职转接
    public static final int TYPE_ON_JOB = 1;

    //类型：离职继承
    public static final int TYPE_RESIGN = 2;
}
