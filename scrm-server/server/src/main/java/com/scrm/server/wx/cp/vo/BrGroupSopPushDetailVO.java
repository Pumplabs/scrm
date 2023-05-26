package com.scrm.server.wx.cp.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群sop-应用推送详情")
public class BrGroupSopPushDetailVO {

    @ApiModelProperty(value = "所属sop名称")
    private String sopName;

    @ApiModelProperty(value = "消息内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO msg;

    @ApiModelProperty(value = "执行方式，1:仅提醒 2:群发 3:朋友圈")
    private Integer way;

    @ApiModelProperty(value = "接收的群聊信息")
    private List<WxGroupChat> chatList;

    @ApiModelProperty(value = "发送状态：0-未发送 1-已发送 2-因客户不是好友导致发送失败 3-因客户已经收到其他群发消息导致发送失败")
    private Integer sendStatus;

    @ApiModelProperty(value = "关联待办状态1:已完成 0:未完成 2:已逾期")
    private Integer todoStatus;

    @ApiModelProperty(value = "关联待办截止时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date todoDeadlineTime;
}
