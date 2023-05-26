package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrSaleTarget;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-07-20
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "销售目标结果集")
public class BrSaleTargetVO extends BrSaleTarget{

    @ApiModelProperty("员工")
    private Staff staff;

    @ApiModelProperty("创建者")
    private Staff creator;

    @ApiModelProperty("已完成")
    private Double finish;

    @ApiModelProperty("完成率")
    private String finishPercent;
}
