package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;

/***
 * @author xuxh
 * @date 2022/4/2 11:30
 */
@Data
@ApiModel(value = "企业微信客户下拉分页请求参数")
@Accessors(chain = true)
public class WxCustomerDropDownPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "客户名称")
    private String name;

    @ApiModelProperty("是否是我自己的客户")
    private Boolean isMySelf;

    @ApiModelProperty(value = "是否查询权限数据：false:否 true:是")
    private Boolean isPermission;

    @ApiModelProperty(value = "是否为企业管理员", hidden = true)
    private Boolean isEnterpriseAdmin;

    @ApiModelProperty(value = "登录员工extId", hidden = true)
    private String loginStaffExtId;

    @ApiModelProperty(value = "标签extId列表")
    private List<String> tagExtIdList;

    @ApiModelProperty(value = "创建开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTimeBegin;

    @ApiModelProperty(value = "创建结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTimeEnd;

}
