package com.scrm.api.wx.cp.dto;

import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author xuxh
 * @date 2022/1/17 16:43
 */
@Data
@ApiModel(value = "客户标签批量打标DTO")
public class WxCustomerBatchMarkingDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    @NotBlank(message = "外部企业ID不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "需要打标的客户ID列表", required = true)
    @NotNull(message = "打标的客户不能为空")
    @Size(min = 1, message = "打标的客户不能为空")
    private List<WxCustomerStaff> customerIds;

    @ApiModelProperty(value = "标签列表")
    private List<String> tagIds;

    @ApiModelProperty(value = "删除标签列表")
    private List<String> removeTags;
}
