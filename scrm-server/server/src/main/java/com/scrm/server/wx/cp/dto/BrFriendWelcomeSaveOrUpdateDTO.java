package com.scrm.server.wx.cp.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-04-23
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "好友欢迎语新增/修改请求参数")
public class BrFriendWelcomeSaveOrUpdateDTO {

    @ApiModelProperty(value = "主键")
    private String id;

    @ApiModelProperty(value = "消息内容")
    private WxMsgDTO msg;

    @ApiModelProperty(value = "删除时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "员工extId")
    private List<String> staffExtIds;

    @ApiModelProperty(value = "部门extId")
    @JsonSerialize(using = ToStringSerializer.class)
    private List<Long> departmentExtIds;

}
