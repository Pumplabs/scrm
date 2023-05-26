package com.scrm.server.wx.cp.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
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
@ApiModel(value = "群sop规则执行详情")
public class BrGroupSopRuleDetailVO {

    @ApiModelProperty(value = "主键id")
    private String id;

    @ApiModelProperty(value = "规则名称")
    private String ruleName;

    @ApiModelProperty(value = "消息内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO msg;

    @ApiModelProperty(value = "触发条件为时间，执行时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date executeAt;

    @ApiModelProperty(value = "重复周期,1:每日 2:每周 3:每两周 4:每月 5:永不 6:自定义")
    private Integer period;

    @ApiModelProperty(value = "结束重复时间")
    private String endAt;

    @ApiModelProperty(value = "自定义间隔天数")
    private Integer customDay;

    @ApiModelProperty(value = "添加好友或创建群聊天数")
    private Integer startDay;

    @ApiModelProperty(value = "添加好友或创建群聊触发，具体执行时间")
    private String startTime;

    @ApiModelProperty(value = "执行方式，1:仅提醒 2:群发 3:朋友圈")
    private Integer way;

    @ApiModelProperty(value = "具体执行信息")
    private List<BrGroupSopRuleExecuteVO> executeDetailList;

}
