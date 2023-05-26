package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import javax.validation.constraints.NotBlank;

/**
 * @author xuxh
 * @date 2022/8/3 17:50
 */
@Data
@ApiModel(value = "企业微信客户协助分页请求参数")
@Accessors(chain = true)
public class WxCustomerAssistPageDTO  extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "客户名称")
    private String name;

    @ApiModelProperty(value = "是否为企业管理员", hidden = true)
    private Boolean isEnterpriseAdmin;

    @ApiModelProperty(value = "登录员工extId", hidden = true)
    private String loginStaffExtId;
}
