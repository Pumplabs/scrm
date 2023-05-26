package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/7/1 15:46
 * @description：根据状态查询员工信息
 **/
@Data
@ApiModel("（群发）根据状态查询员工信息")
public class TemplateFilterDTO {

    @NotNull(message = "id不能为空")
    @ApiModelProperty("id")
    private String id;
    
    @ApiModelProperty("状态列表")
    private List<Integer> statusList;
    
    @ApiModelProperty("名称")
    private String name;
}
