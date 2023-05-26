package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

/**
 * @author xxh
 * @since 2022-02-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户群发修改请求参数")
public class WxMsgTemplateUpdateDTO {

    @ApiModelProperty(value = "'ID'")
    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "创建者外部员工ID")
    private String creatorId;

    @ApiModelProperty(value = "是否定时发送，1->是，0->不是（立即发送）")
    @NotNull(message = "请选择发送类型")
    private Boolean hasSchedule;

    @ApiModelProperty(value = "如果是定时发送的发送时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date sendTime;

    @ApiModelProperty(value = "消息内容")
    private WxMsgDTO msg;

    @ApiModelProperty("群发名称")
    private String name;

    @ApiModelProperty(value = "是否全部员工")
    @NotNull(message = "请选择是否全部员工")
    private Boolean hasAllStaff;

    @ApiModelProperty(value = "选择的员工id")
    private List<String> staffIds;

    @ApiModelProperty(value = "是否全部客户,1是，0否")
    private Boolean hasAllCustomer;

    @ApiModelProperty(value = "筛选条件的性别，0->全部，1->男，2->女，3->未知")
    private Integer sex;

    @ApiModelProperty(value = "筛选条件的群聊id")
    private List<String> chatIds;

    @ApiModelProperty(value = "筛选条件的添加开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date addStartTime;

    @ApiModelProperty(value = "筛选条件的添加结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date addEndTime;

    @ApiModelProperty(value = "筛选条件的选择标签，1->满足其一，2->全部满足，3->无任何标签")
    private Integer chooseTagType;

    @ApiModelProperty(value = "选择的标签数组")
    private List<String> chooseTags;

    @ApiModelProperty(value = "排除在外的标签")
    private List<String> excludeTags;

    @ApiModelProperty(value = "是否开启客户去重，1->开启，0->关闭")
    private Boolean hasDistinct;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "'删除时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deletedAt;

}
