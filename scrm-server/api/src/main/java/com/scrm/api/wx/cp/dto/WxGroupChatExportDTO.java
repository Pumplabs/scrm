package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author xuxh
 * @date 2022/2/23 17:40
 */
@Data
@ApiModel(value = "客户群导出请求参数" )
public class WxGroupChatExportDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "请输入外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "群名字")
    private String name;

    @ApiModelProperty(value = "群主名称")
    private String ownerName;

    @ApiModelProperty(value = "群主ID列表")
    private List<String> ownerIds;

    @ApiModelProperty(value = "标签名称")
    private String tagName;
}
