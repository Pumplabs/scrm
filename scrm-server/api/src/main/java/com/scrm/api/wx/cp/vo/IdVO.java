package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/5 23:18
 * @description：id的VO
 **/
@ApiModel("操作的id信息")
@Data
@Accessors(chain = true)
public class IdVO {

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "id")
    @NotNull(message = "id必填！")
    private String id;
}
