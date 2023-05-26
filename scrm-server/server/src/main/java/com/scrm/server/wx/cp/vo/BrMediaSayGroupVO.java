package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrMediaSayGroup;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-05-10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业微信话术组管理结果集")
public class BrMediaSayGroupVO extends BrMediaSayGroup{

    @ApiModelProperty("数量")
    private Integer num;

}
