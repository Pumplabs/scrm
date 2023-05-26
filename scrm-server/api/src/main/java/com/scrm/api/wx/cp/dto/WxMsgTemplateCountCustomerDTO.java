package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/2/12 17:47
 * @description：微信群发统计客户数VO
 **/
@Data
@ApiModel("微信群发统计客户数VO")
public class WxMsgTemplateCountCustomerDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "是否全部员工")
    @NotNull(message = "请选择是否全部员工")
    private Boolean hasAllStaff;

    @ApiModelProperty(value = "选择的员工id")
    private List<String> staffIds;

    @ApiModelProperty(value = "是否全部客户,1是，0否")
    private Boolean hasAllCustomer;

    @ApiModelProperty(value = "筛选条件的性别，性别,0-未知 1-男性 2-女性,全部不需要传")
    private Integer sex;

    @ApiModelProperty(value = "筛选条件的群聊id,用那个extChatId")
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

    @ApiModelProperty(value = "选择的客户id集合(extId)")
    private List<String> customerIds;

}
