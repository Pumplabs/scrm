package com.scrm.server.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * 微信第三方平台授权信息
 * @author xxh
 * @since 2022-04-30
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "微信第三方平台授权信息")
@TableName(value = "br_mp_accredit", autoResultMap = true)
public class BrMpAccredit implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "授权企业的appid")
    private String authorizerAppId;

    @ApiModelProperty(value = "刷新令牌（在授权的公众号具备API权限时，才有此返回值），刷新令牌主要用于第三方平台获取和刷新已授权用户的 authorizer_access_token。一旦丢失，只能让用户重新授权，才能再次拿到新的刷新令牌。用户重新授权后，之前的刷新令牌会失效")
    private String authorizerRefreshToken;

    @ApiModelProperty(value = "授权给开发者的权限集列表")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private Object funcInfo;

    @ApiModelProperty(value = "昵称")
    private String nickName;

    @ApiModelProperty(value = "头像")
    private String headImg;

    @ApiModelProperty(value = "公众号类型")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private Object serviceTypeInfo;

    @ApiModelProperty(value = "公众号认证类型")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private Object verifyTypeInfo;

    @ApiModelProperty(value = "原始 ID")
    private String userName;

    @ApiModelProperty(value = "主体名称")
    private String principalName;

    @ApiModelProperty(value = "公众号所设置的微信号，可能为空")
    private String alias;

    @ApiModelProperty(value = "用以了解功能的开通状况（0代表未开通，1代表已开通），详见business_info 说明")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private Object businessInfo;

    @ApiModelProperty(value = "二维码图片的 URL，开发者最好自行也进行保存")
    private String qrcodeUrl;

    @ApiModelProperty(value = "帐号状态，该字段小程序也返回")
    private Integer accountStatus;

    @ApiModelProperty("不知")
    private Integer idc;

    @ApiModelProperty("帐号介绍")
    private String signature;

    @ApiModelProperty("小程序配置，根据这个字段判断是否为小程序类型授权")
    private Object miniProgramInfo;

    @ApiModelProperty("是否是小程序")
    private Boolean hasProgram;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;


}
