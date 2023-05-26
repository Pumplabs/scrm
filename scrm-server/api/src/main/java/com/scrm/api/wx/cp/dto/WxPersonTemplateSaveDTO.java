package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/6/26 15:32
 * @description：个人群发新增DTO
 **/
@Data
@ApiModel("个人群发新增DTO")
public class WxPersonTemplateSaveDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "消息内容")
    @NotNull(message = "请填写消息内容")
    private WxMsgDTO msg;

    @ApiModelProperty("群发名称")
    private String name;
}
