package com.scrm.api.wx.cp.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

/**
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-裂变任务信息新增DTO")
public class WxFissionTaskSaveDTO {

    @ApiModelProperty(value = "企业id")
    @NotNull(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "活动名称限制字数20个字")
    @NotNull(message = "活动名称不能为空")
    @Size(max = 20, message = "活动名称最长20个字")
    private String name;

    @ApiModelProperty(value = "发送的消息")
    @NotNull(message = "发送的消息不能为空")
    private WxMsgDTO msg;

    @ApiModelProperty(value = "(保存传0，保存并发布传1)状态，0->未开始，1->进行中，2->已结束")
    @NotNull(message = "状态不能为空")
    @Max(value = 1, message = "状态参数错误")
    private Integer status;

    @ApiModelProperty("客户参加这个活动加进来被打上的标签")
    private List<String> tags;

    @ApiModelProperty(value = "选择的企业员工")
    @NotNull(message = "选择的企业员工不能为空")
    private List<String> extStaffIds;

    @ApiModelProperty(value = "结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @NotNull(message = "结束时间不能为空")
    private Date endTime;

    @ApiModelProperty(value = "二维码失效时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @NotNull(message = "二维码失效时间不能为空")
    private Date codeExpiredTime;

    @ApiModelProperty(value = "二维码失效时间")
    @NotNull(message = "二维码失效时间不能为空")
    private Integer codeExpiredDays;

    @ApiModelProperty(value = "删除员工后好友助力是否失效，1->失效，0->不失效")
    @NotNull(message = "删除员工后好友助力是否失效不能为空")
    private Boolean hasCheckDelete;

    @ApiModelProperty(value = "海报文件id")
    @NotNull(message = "海报文件id不能为空")
    private String posterFileId;

    @ApiModelProperty(value = "如果海报是选的素材库，就有这个id")
    private String mediaInfoId;

    @ApiModelProperty(value = "发送客户列表")
    private List<String> extCustomerIds;

    @ApiModelProperty(value = "是否有用户头像")
    @NotNull(message = "是否有用户头像不能为空")
    private Boolean hasHead;

    @ApiModelProperty(value = "是否有用户名")
    @NotNull(message = "是否有用户名不能为空")
    private Boolean hasName;

    @ApiModelProperty(value = "海报尺寸，长宽")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private ImgInfoDTO posterSize;

    @ApiModelProperty(value = "头像的xy坐标,长宽")
    private ImgInfoDTO headPos;

    @ApiModelProperty(value = "昵称的xy坐标,长宽")
    private ImgInfoDTO namePos;

    @ApiModelProperty(value = "二维码的xy坐标,长宽")
    @NotNull(message = "二维码的xy坐标,长宽不能为空")
    private ImgInfoDTO qrCodePos;

    @ApiModelProperty(value = "用户名的颜色rgb")
    private ImgRbgDTO nameColor;

    @ApiModelProperty(value = "阶段信息")
    @NotNull(message = "阶段信息必填")
    private List<WxFissionStageSaveDTO> stageSaveDTOS;
}
