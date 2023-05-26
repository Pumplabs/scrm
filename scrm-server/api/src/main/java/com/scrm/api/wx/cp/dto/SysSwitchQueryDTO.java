package com.scrm.api.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author xxh
 * @since 2022-03-26
 */
@Data
@ApiModel(value = "条件查询请求参数" )
@Accessors(chain = true)
public class SysSwitchQueryDTO {

    @ApiModelProperty("企业id" )
    @NotNull(message = "企业id不能为空" )
    private String extCorpId;

    @ApiModelProperty("按钮编码列表 当客户删除员工时，通知被删除员工:0 当员工删除客户时，通知管理员: 1" )
    private List<String> codeList;

}
