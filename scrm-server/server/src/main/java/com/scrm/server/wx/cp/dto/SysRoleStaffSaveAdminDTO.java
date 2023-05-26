package com.scrm.server.wx.cp.dto;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel(value = "角色-员工关联新增管理员DTO")
public class SysRoleStaffSaveAdminDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "员工extId列表",required = true)
    @NotNull(message = "员工不能为空")
    @Size(min = 1,message = "员工不能为空")
    private List<String> extStaffIds;
}
