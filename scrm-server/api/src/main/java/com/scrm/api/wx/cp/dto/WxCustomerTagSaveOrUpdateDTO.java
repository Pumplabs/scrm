package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.List;

/**
 * @Author: xxh
 * @Date: 2022/1/2 20:55
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户标签新增修改DTO")
public class WxCustomerTagSaveOrUpdateDTO implements Serializable {

    @ApiModelProperty(value = "客户ID", required = true)
    @NotBlank(message = "客户ID不能为空")
    private String id;

    private String extCorpId;

    @ApiModelProperty(value = "员工ID", required = true)
    @NotBlank(message = "员工ID不能为空")
    private String staffId;

    @ApiModelProperty(value = "新增标签列表")
    private List<String> addTags;

    @ApiModelProperty(value = "删除标签列表")
    private List<String> removeTags;

    //打标签的来源
    private String origin;

    //打标签的操作人的extId
    private String operatorExtId;

    private static final long serialVersionUID = 1L;
}
