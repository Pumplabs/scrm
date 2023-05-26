package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;


/**
 * @author xuxh
 * @date 2022/4/7 14:10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "旅程阶段新增/修改DTO")
public class BrJourneyStageSaveOrUpdateDTO {

    @ApiModelProperty(value = "主键")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "备注")
    private String remark;

    @ApiModelProperty(value = "排序")
    private Integer sort;

}
