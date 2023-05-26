package com.scrm.common.entity;

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
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * 企业授权信息
 * @author xxh
 * @since 2022-04-10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业授权信息")
@TableName(value = "br_corp_accredit", autoResultMap = true)
public class BrCorpAccredit implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "授权方企业微信id")
    private String corpId;

    @ApiModelProperty(value = "企业微信永久授权码,最长为512字节")
    private String permanentCode;

    @ApiModelProperty(value = "授权企业信息")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxCpTpPermanentCodeInfo.AuthCorpInfo authCorpInfo;

    @ApiModelProperty(value = "授权信息。如果是通讯录应用，且没开启实体应用，是没有该项的。通讯录应用拥有企业通讯录的全部信息读写权限")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxCpTpPermanentCodeInfo.AuthInfo authInfo;

    @ApiModelProperty(value = "授权用户信息")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxCpTpPermanentCodeInfo.AuthUserInfo authUserInfo;

    @ApiModelProperty("企业id（让用户填的）")
    private String initCorpId;

    @ApiModelProperty("通讯录密钥（让用户填的）")
    private String addressListSecret;

    @ApiModelProperty("客户联系密钥（让用户填的）")
    private String customerContactSecret;

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
