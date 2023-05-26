package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/5 23:32
 * @description：微信群群发-员工详情
 **/
@ApiModel("微信群群发-员工详情")
@Data
public class MsgGroupStaffSearchDTO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "这个群发的id，必填")
    @NotNull(message = "请选择查询的群发")
    private String templateId;

    @ApiModelProperty("是否已发送")
    private Boolean hasSend;

    @ApiModelProperty("群主extId")
    private String ownerExtId;
}
