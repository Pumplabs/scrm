package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;

/**
 * @author xxh
 * @since 2022-05-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户跟进修改请求参数")
public class BrCustomerFollowUpdateDTO {

    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "客户extId")
    private String extCustomerId;

    @ApiModelProperty(value = "跟进内容")
    private WxMsgDTO content;

    @ApiModelProperty(value = "分享给的员工的extid")
    private List<String> shareExtStaffIds;

    @ApiModelProperty(value = "是否设置待办任务 1：是 0：否")
    private Boolean isTodo;

    @ApiModelProperty(value = "跟进任务集合")
    private List<BrFollowTaskSaveOrUpdateDTO> followTaskList;

    @ApiModelProperty(value = "跟进提醒时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date remindAt;
}
