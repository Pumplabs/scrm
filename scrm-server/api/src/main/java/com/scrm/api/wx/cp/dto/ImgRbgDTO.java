package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import lombok.Data;


@ApiModel("图片rgb信息")
@Data
public class ImgRbgDTO {

    private Integer red;

    private Integer green;

    private Integer blue;

}
