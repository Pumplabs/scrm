package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2022-05-19
 */
@Data
@ApiModel(value = "客户跟进分页请求参数")
@Accessors(chain = true)
public class BrCustomerFollowPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("是否全部， true->全部， false->我的")
    private Boolean hasAll;

    @ApiModelProperty("是否是主页，true->主页，false->侧边栏")
    private Boolean hasMain;

    @ApiModelProperty("客户extid")
    private String extCustomerId;

    @ApiModelProperty(value = "跟进类型 1：客户 2：商机")
    private Integer type;

    @ApiModelProperty(value = "是否查询权限数据：false:否 true:是")
    private Boolean isPermission;


}

