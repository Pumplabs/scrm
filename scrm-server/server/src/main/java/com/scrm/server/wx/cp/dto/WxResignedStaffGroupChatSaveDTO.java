package com.scrm.server.wx.cp.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-06-27
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "离职员工-群聊关联新增DTO")
public class WxResignedStaffGroupChatSaveDTO {

    
    @ApiModelProperty(value = "是否移交")
    private Boolean isHandOver;

    @ApiModelProperty(value = "企业id")
    private String extCorpId;

    @ApiModelProperty(value = "接替群主成员ID")
    private String takeoverStaffExtId;

    @ApiModelProperty(value = "原群主成员ID")
    private String handoverStaffExtId;

    @ApiModelProperty(value = "成员离职时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date dimissionTime;

    @ApiModelProperty(value = "状态：0：跟进人正常，1：跟进人离职 2：离职继承中	3：离职继承完成")
    private Integer status;

    @ApiModelProperty(value = "客户群ID")
    private String groupChatExtId;

    @ApiModelProperty(value = "操作人用户ID")
    private String creator;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @ApiModelProperty(value = "分配时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date allocateTime;

}
