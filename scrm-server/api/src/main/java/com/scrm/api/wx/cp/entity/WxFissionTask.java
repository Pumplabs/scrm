package com.scrm.api.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.ImgInfoDTO;
import com.scrm.api.wx.cp.dto.ImgRbgDTO;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 企微应用宝-裂变任务信息
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-裂变任务信息")
@TableName(value = "wx_fission_task", autoResultMap = true)
public class WxFissionTask implements Serializable{

    private static final long serialVersionUID=1L;

    @TableId
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "活动名称限制字数20个字")
    private String name;

    @ApiModelProperty(value = "发送的消息")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO msg;

    @ApiModelProperty(value = "状态，0->未开始，1->进行中，2->已结束")
    private Integer status;

    @ApiModelProperty(value = "选择的企业员工")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> extStaffIds;

    @ApiModelProperty(value = "结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date endTime;

    @ApiModelProperty(value = "二维码失效时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date codeExpiredTime;

    @ApiModelProperty(value = "二维码失效时间")
    private Integer codeExpiredDays;

    @ApiModelProperty(value = "删除员工后好友助力是否失效，1->失效，0->不失效")
    private Boolean hasCheckDelete;

    @ApiModelProperty("客户参加这个活动加进来被打上的标签")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<String> tags;

    @ApiModelProperty(value = "海报文件id")
    private String posterFileId;

    @ApiModelProperty(value = "是否有用户头像")
    private Boolean hasHead;

    @ApiModelProperty(value = "是否有用户名")
    private Boolean hasName;

    @ApiModelProperty(value = "海报尺寸，长宽")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private ImgInfoDTO posterSize;

    @ApiModelProperty(value = "头像的xy坐标,长宽")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private ImgInfoDTO headPos;

    @ApiModelProperty(value = "昵称的xy坐标,长宽")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private ImgInfoDTO namePos;

    @ApiModelProperty(value = "二维码的xy坐标,长宽")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private ImgInfoDTO qrCodePos;

    @ApiModelProperty(value = "用户名的颜色rgb")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private ImgRbgDTO nameColor;

    @ApiModelProperty(value = "XXLJOB的id")
    private Integer jobId;

    @ApiModelProperty(value = "创建人")
    private String creatorExtId;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "更新时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableLogic
    private Date deletedAt;

    public static final int STATUS_NO_START = 0;

    public static final int STATUS_START = 1;

    public static final int STATUS_OVER = 2;
}
