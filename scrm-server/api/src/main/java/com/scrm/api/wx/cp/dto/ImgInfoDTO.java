package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
@ApiModel("图片信息")
public class ImgInfoDTO {

    @ApiModelProperty("图片宽度")
    private Integer width;

    @ApiModelProperty("图片高度")
    private Integer height;

    @ApiModelProperty("图片x轴起点")
    private Integer x;

    @ApiModelProperty("图片y轴起点")
    private Integer y;
}
