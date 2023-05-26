package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * @author xxh
 * @since 2021-12-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "修改请求参数")
public class StaffDepartmentUpdateDTO {

    private String extCorpId;

    private String extStaffId;

    private String extDepartmentId;

    @NotBlank(message = "id不能为空")
    private String staffId;

    private String departmentId;

    @ApiModelProperty(value = "是否是所在部门的领导")
    private String isLeader;

    @ApiModelProperty(value = "所在部门的排序")
    private String order;

}
