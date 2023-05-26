package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.vo.SimpleStaffVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/3 23:17
 * @description：微信群群发-员工详情
 **/
@Data
@ApiModel("微信群群发-员工详情")
public class MsgGroupStaffDTO {

    @ApiModelProperty("群主的信息都在里面了")
    private SimpleStaffVO ownerInfo;

    @ApiModelProperty("发送状态：0-未发送 1-已发送")
    private Boolean sendStatus;

    @ApiModelProperty("确认发送时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date sendTime;

    @ApiModelProperty("发送的群聊消息")
    private List<MsgGroupChatDTO> chatInfo;

    @ApiModelProperty("发送的群聊总数")
    private Integer total = 0;

    @ApiModelProperty("未发送的群聊数")
    private Integer noSendCount = 0;

    @ApiModelProperty("已发送的群聊数")
    private Integer sendCount = 0;
}
