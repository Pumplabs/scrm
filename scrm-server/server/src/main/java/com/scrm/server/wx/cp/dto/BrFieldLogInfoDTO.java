package com.scrm.server.wx.cp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;


/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/18 15:09
 * @description：动态详细信息
 **/
@Data
@Accessors(chain = true)
@ApiModel("动态详细信息")
public class BrFieldLogInfoDTO {

    @ApiModelProperty("动态id")
    private String contentId;

    @ApiModelProperty("动态内容")
    private String content;

}
