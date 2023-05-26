package com.scrm.api.wx.cp.vo;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/24 17:34
 * @description：id的分页VO
 **/
@ApiModel("企微应用宝id的分页VO")
@Data
public class WxFissionContactQueryVO extends BasePageDTO {

    @ApiModelProperty(value = "外部企业ID")
    @NotBlank(message = "企业id必填！")
    private String extCorpId;

    @ApiModelProperty(value = "id")
    @NotBlank(message = "id必填！")
    private String id;

    @ApiModelProperty("客户昵称")
    private String name;

    @ApiModelProperty("是否流失")
    private Boolean hasLose;

    @ApiModelProperty("完成阶段")
    private Integer finishStage;
}
