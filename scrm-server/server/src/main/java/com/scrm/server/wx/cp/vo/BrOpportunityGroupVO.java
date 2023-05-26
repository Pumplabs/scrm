package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrOpportunityGroup;
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
@ApiModel(value = "商机分组结果集")
public class BrOpportunityGroupVO extends BrOpportunityGroup{

    @ApiModelProperty("创建人名字")
    private String creatorCN;

}
