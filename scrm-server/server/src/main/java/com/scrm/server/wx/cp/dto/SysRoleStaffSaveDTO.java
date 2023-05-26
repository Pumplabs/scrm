package com.scrm.server.wx.cp.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author xxh
 * @since 2022-06-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "角色-员工关联新增DTO")
public class SysRoleStaffSaveDTO {


    @ApiModelProperty(value = "外部企业ID", required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "角色ID",required = true)
    @NotBlank(message = "角色ID不能为空")
    private String roleId;

    @ApiModelProperty(value = "员工extId列表",required = true)
    @NotNull(message = "员工不能为空")
    @Size(min = 1,message = "员工不能为空")
    private List<String> extStaffIds;


}
