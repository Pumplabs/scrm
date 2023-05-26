package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author xxh
 * @since 2022-05-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户跟进提醒DTO")
public class BrCustomerFollowRemindDTO {

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "跟进id")
    private String followId;

    @ApiModelProperty(value = "员工extId")
    private String staffExtId;

}
