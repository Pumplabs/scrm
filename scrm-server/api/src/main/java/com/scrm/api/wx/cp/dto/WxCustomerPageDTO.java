package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
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
 * @since 2021-12-22
 */
@Data
@ApiModel(value = "企业微信客户分页请求参数")
@Accessors(chain = true)
public class WxCustomerPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "客户名称")
    private String name;

    @ApiModelProperty(value = "创建者外部员工ID")
    private List<String> extCreatorId;

    @ApiModelProperty(value = "员工ID列表")
    private List<String> staffIds;

    @ApiModelProperty(value = "'填加时间-开始'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtBegin;

    @ApiModelProperty(value = "'填加时间-结束'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtEnd;

    @ApiModelProperty(value = "性别,0-未知 1-男性 2-女性")
    private Integer gender;

    @ApiModelProperty(value = "类型,1-微信用户, -企业微信用户")
    private Integer type;

    @ApiModelProperty("在职/离职转接状态")
    private List<Integer> noTransferInfoStatus;

    @ApiModelProperty(value = "是否查询权限数据：false:否 true:是")
    private Boolean isPermission;

    @ApiModelProperty(value = "是否为企业管理员", hidden = true)
    private Boolean isEnterpriseAdmin;

    @ApiModelProperty(value = "登录员工extId", hidden = true)
    private String loginStaffExtId;

    @ApiModelProperty(value = "标签extId列表")
    private List<String> tagExtIdList;

    //后台字段
    private List<String> noCustomerIds;
}

