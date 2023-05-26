package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.ContactWay;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxTag;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2021-12-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "渠道活码结果集")
public class ContactWayVO extends ContactWay{

    @ApiModelProperty("自动打的标签列表")
    private List<WxTag> customerTags;

    @ApiModelProperty("员工列表")
    private List<Staff> staffs;

    @ApiModelProperty("备用员工列表")
    private List<Staff> backOutStaffs;

    @ApiModelProperty("创建者信息")
    private Staff creatorInfo;
}
