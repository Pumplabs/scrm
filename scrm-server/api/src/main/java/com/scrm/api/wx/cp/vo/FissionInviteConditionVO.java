package com.scrm.api.wx.cp.vo;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import javax.validation.constraints.NotBlank;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/24 17:58
 * @description：（企微宝）获取邀请详情的条件
 **/
@Data
@ApiModel("（企微宝）获取邀请详情的条件")
public class FissionInviteConditionVO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "外部企业ID")
    private String corpId;

    @ApiModelProperty(value = "extCustomerId")
    @NotBlank(message = "extCustomerId必填！")
    private String extCustomerId;

    @ApiModelProperty(value = "taskId")
    @NotBlank(message = "taskId必填！")
    private String taskId;

    /**
     * 由于历史原因。。。。
     * @return
     */
    public String getExtCorpId() {
        return StringUtils.isNotBlank(extCorpId) ? extCorpId: corpId;
    }
}
