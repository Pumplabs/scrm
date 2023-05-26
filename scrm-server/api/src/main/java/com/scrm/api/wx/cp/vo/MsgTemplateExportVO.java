package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/2/21 17:50
 * @description：导出条件VO
 **/
@Data
@ApiModel("客户群发，导出条件VO")
public class MsgTemplateExportVO {

    @NotNull(message = "请选择企业")
    @ApiModelProperty("你懂的")
    private String extCorpId;

    @ApiModelProperty("群发id")
    @NotNull(message = "请选择群发")
    private String templateId;

    @ApiModelProperty("状态，全部传null")
    private Integer status;

    @ApiModelProperty("状态名，全部，已发送人员，未发送人员，已送达，未送达这些")
    @NotNull(message = "请选择导出的状态")
    private String statusCN;
}
