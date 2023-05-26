package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

/**
 * @author xxh
 * @since 2022-03-02
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群聊-群发消息新增DTO")
public class WxMsgGroupTemplateSaveDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "是否定时发送，1->是，0->不是")
    @NotNull(message = "请选择是否定时发送")
    private Boolean hasSchedule;

    @ApiModelProperty(value = "任务名")
    @Size(max = 255, message = "任务名请不要超过255个字符")
    private String name;

    @ApiModelProperty(value = "发送时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date sendTime;

    @ApiModelProperty(value = "消息内容")
    private WxMsgDTO msg;

    @ApiModelProperty(value = "是否全部群主：1->是，0->不是")
    private Boolean hasAllStaff;

    @ApiModelProperty(value = "群主id")
    private List<String> extStaffIds;

    @ApiModelProperty(value = "状态，0->待发送，1->发送成功，2->已取消，3->发送失败")
    private Integer status;


}
