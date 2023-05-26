package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author ouyang
 * @description 添加/删除用户席位
 * @date 2022/5/7 17:44
 */
@Data
@ApiModel(value = "修改员工席位请求参数")
@Accessors(chain = true)
public class UpdateSeatDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("添加员工extid集合")
    private List<String> addStaffIds;

    @ApiModelProperty("移除员工extid集合")
    private List<String> delStaffIds;
}
