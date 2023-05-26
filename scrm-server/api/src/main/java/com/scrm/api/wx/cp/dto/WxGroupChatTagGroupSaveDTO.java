package com.scrm.api.wx.cp.dto;


import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;


/**
 * @author xxh
 * @since 2022-02-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊标签组新增DTO")
public class WxGroupChatTagGroupSaveDTO {


    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "标签列表")
    private List<WxGroupChatTagSaveDTO> tagList;


}
