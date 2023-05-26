package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.BrJourney;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-04-06
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "旅程信息结果集")
public class BrJourneyVO extends BrJourney{

    @ApiModelProperty(value = "创建员工信息")
    private Staff creatorStaff;


}
