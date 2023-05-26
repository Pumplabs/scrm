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
 * @since 2021-12-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户修改请求参数")
public class WxCustomerUpdateDTO {

    @ApiModelProperty(value = "'ID'")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String extCreatorId;

    @ApiModelProperty(value = "微信定义的userID")
    private String extId;

    @ApiModelProperty(value = "名称，微信用户对应微信昵称；企业微信用户，则为联系人或管理员设置的昵称、认证的实名和账号名称")
    private String name;

    @ApiModelProperty(value = "职位,客户为企业微信时使用")
    private String position;

    @ApiModelProperty(value = "客户的公司名称,仅当客户ID为企业微信ID时存在")
    private String corpName;

    @ApiModelProperty(value = "头像")
    private String avatar;

    @ApiModelProperty(value = "类型,1-微信用户, 2-企业微信用户")
    private String type;

    @ApiModelProperty(value = "性别,0-未知 1-男性 2-女性")
    private String gender;

    @ApiModelProperty(value = "微信开放平台的唯一身份标识(微信unionID)")
    private String unionid;

    @ApiModelProperty(value = "仅当联系人类型是企业微信用户时有此字段")
    private String externalProfile;

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
