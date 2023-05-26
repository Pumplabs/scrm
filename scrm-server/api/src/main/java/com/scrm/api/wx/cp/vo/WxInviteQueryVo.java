package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * @Author: xxh
 * @Date: 2021/12/13 01:22
 */
@Data
@ApiModel(value = "邀请成员请求参数")
public class WxInviteQueryVo {

    @ApiModelProperty(value = "成员ID列表(最多支持1000个)")
    private List<String> userIds;

    @ApiModelProperty(value = "部门ID列表(最多支持1000个)")
    private List<String> partyIds;

    @ApiModelProperty(value = "标签ID列表(最多支持1000个)")
    private List<String> tagIds;
}
