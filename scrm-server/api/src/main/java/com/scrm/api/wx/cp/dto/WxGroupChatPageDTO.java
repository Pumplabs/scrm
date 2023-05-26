package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author xxh
 * @since 2022-01-19
 */
@ApiModel(value = "客户群分页请求参数" )
@Data
@Accessors(chain = true)
public class WxGroupChatPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "请输入外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "群名字")
    private String name;

    @ApiModelProperty(value = "群主名称")
    private String ownerName;

    @ApiModelProperty(value = "群主ExtId列表")
    private List<String> ownerExtIds;

    @ApiModelProperty(value = "标签名称")
    private String tagName;

    @ApiModelProperty(value = "是否查询权限数据：false:否 true:是")
    private Boolean isPermission;

    @ApiModelProperty(value = "是否为企业管理员", hidden = true)
    private Boolean isEnterpriseAdmin;

    @ApiModelProperty(value = "登录员工extId", hidden = true)
    private String loginStaffExtId;

    @ApiModelProperty(value = "标签ID列表")
    private List<String> tagIds;
}

