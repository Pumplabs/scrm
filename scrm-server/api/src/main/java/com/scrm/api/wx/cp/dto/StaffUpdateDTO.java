package com.scrm.api.wx.cp.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2021-12-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业员工修改请求参数")
public class StaffUpdateDTO {

    @ApiModelProperty(value = "'ID'")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "外部员工ID")
    private String extId;

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

    @ApiModelProperty(value = "手机号（手机和邮箱至少有个非空）")
    private String mobile;

    @ApiModelProperty(value = "二维码")
    private String qrCodeUrl;

    @ApiModelProperty(value = "电话")
    private String telephone;

    private String enable;

    @ApiModelProperty(value = "微信返回的内容签名")
    private String signature;

    private String externalPosition;

    private String externalProfile;

    private String extattr;

    private Integer customerCount;

    private String deptIds;

    private String welcomeMsgId;

    private String isAuthorized;

    private String enableMsgArch;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "'删除时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

}
