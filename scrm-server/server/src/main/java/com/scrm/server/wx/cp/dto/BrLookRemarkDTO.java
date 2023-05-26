package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/7/18 20:20
 * @description：查询素材客户浏览记录
 **/
@Data
@ApiModel("查询素材客户浏览记录")
public class BrLookRemarkDTO extends BasePageDTO {
    
    private String extCorpId;
    
    @ApiModelProperty("素材id")
    @NotNull(message = "请传入素材id")
    private String id;
}
