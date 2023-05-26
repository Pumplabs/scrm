package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrCommonConf;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "通用配置结果集")
public class BrCommonConfVO extends BrCommonConf {

    @ApiModelProperty(value = "关联数量")
    private Integer relateCount;

}
