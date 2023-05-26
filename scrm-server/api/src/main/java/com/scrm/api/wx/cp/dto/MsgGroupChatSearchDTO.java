package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/5 22:22
 * @description：微信群群发-群聊详情-查询条件
 **/
@Data
@ApiModel("微信群群发-群聊详情-查询条件")
public class MsgGroupChatSearchDTO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "这个群发的id，必填")
    @NotNull(message = "请选择查询的群发")
    private String templateId;

    @ApiModelProperty("群聊名搜索条件")
    private String chatName;

    @ApiModelProperty("群主extId搜索条件")
    private String ownerExtId;

    @ApiModelProperty("状态搜索条件，0->未发送 1->已发送 -1->已失败")
    private Integer status;

}
