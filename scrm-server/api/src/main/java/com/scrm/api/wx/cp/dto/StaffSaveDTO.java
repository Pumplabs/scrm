package com.scrm.api.wx.cp.dto;


import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;


/**
 * @author xxh
 * @since 2021-12-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业员工新增DTO")
public class StaffSaveDTO {


    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "角色ID")
    private String roleId;

    @ApiModelProperty(value = "'角色类型'")
    private String roleType;

    @ApiModelProperty(value = "员工名",required = true)
    @NotBlank(message = "员工名不能为空")
    private String name;

    @ApiModelProperty(value = "地址")
    private String address;

    @ApiModelProperty(value = "别名")
    private String alias;

    @ApiModelProperty(value = "头像地址")
    private String avatarUrl;

    @ApiModelProperty(value = "邮箱（手机和邮箱至少有个非空）")
    private String email;

    @ApiModelProperty(value = "0表示未定义，1表示男性，2表示女性")
    private String gender;

    @ApiModelProperty(value = "激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业。已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。")
    private String status;

    @ApiModelProperty(value = "手机号")
    private String mobile;

    @ApiModelProperty(value = "二维码")
    private String qrCodeUrl;

    @ApiModelProperty(value = "电话（手机和邮箱至少有个非空）")
    private String telephone;

    private String enable;

    @ApiModelProperty(value = "微信返回的内容签名")
    private String signature;

    private String externalPosition;

    private String externalProfile;

    private String extattr;

    private Integer customerCount;

    @ApiModelProperty(value = "企业部门id列表json",required = true)
    @NotBlank(message = "所属企业部门不能为空")
    private String deptIds;

    private String welcomeMsgId;

    private String isAuthorized;

    private String enableMsgArch;



}
