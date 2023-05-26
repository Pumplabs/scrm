package com.scrm.server.wx.cp.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * sop规则,定时任务传参用
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
public class BrSopRuleParamDto{

    @ApiModelProperty(value = "主键id")
    @TableId
    private String id;

    @ApiModelProperty(value = "所属sopid")
    private String sopId;

    @ApiModelProperty(value = "定时任务id")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<Integer> jobId;

    @ApiModelProperty(value = "规则名称")
    private String name;

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

    @ApiModelProperty(value = "执行方式，1:仅提醒 2:群发 3:朋友圈")
    private Integer way;

    @ApiModelProperty(value = "创建人")
    private String creator;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "消息内容")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private WxMsgDTO msg;

    @ApiModelProperty(value = "所属名称")
    private String sopName;

    @ApiModelProperty(value = "所属sop状态")
    private Integer sopStatus;

    @ApiModelProperty(value = "任务截止天数")
    private Integer limitDay;

    @ApiModelProperty(value = "任务截止小时数")
    private Integer limitHour;

}
