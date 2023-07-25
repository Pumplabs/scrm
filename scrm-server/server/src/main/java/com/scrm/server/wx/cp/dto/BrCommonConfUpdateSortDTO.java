package com.scrm.server.wx.cp.dto;

import com.scrm.server.wx.cp.entity.BrCommonConf;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel(value = "商机阶段重新排序参数")
public class BrCommonConfUpdateSortDTO {

    @ApiModelProperty(value = "主键")
    @NotBlank(message = "groupId不能为空")
    private String groupId;

    @ApiModelProperty(value = "阶段列表")
    private List<BrCommonConf> brCommonConfList;

}
