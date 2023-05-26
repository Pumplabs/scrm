package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxFissionTask;
import com.scrm.api.wx.cp.entity.WxTempFile;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-裂变任务信息结果集")
public class WxFissionTaskVO extends WxFissionTask{

    @ApiModelProperty("创建者信息")
    private Staff creatorInfo;

    @ApiModelProperty("添加客户数")
    private Integer count;

    @ApiModelProperty("接待员工信息")
    private List<Staff> staffVOList;

    @ApiModelProperty("海报文件信息")
    private WxTempFile posterFile;

    @ApiModelProperty("任务阶段数")
    private List<WxFissionStageVO> wxFissionStageVOS;

    @ApiModelProperty("邀请链接")
    private String inviteLink;

    @ApiModelProperty(value = "本地活动的直接投放渠道码请求链接")
    private String qrCode;

    @ApiModelProperty("标签名集合")
    private List<String> tagList;
}
