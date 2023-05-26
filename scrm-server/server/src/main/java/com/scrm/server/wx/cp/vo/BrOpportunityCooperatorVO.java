package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrOpportunityCooperator;
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
@ApiModel(value = "商机-协作人关联结果集")
public class BrOpportunityCooperatorVO extends BrOpportunityCooperator{

    @ApiModelProperty(value = "协作人")
    private Staff cooperatorStaff;

}
