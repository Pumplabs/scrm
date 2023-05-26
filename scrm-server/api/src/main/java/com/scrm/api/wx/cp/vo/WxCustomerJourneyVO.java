package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.BrJourney;
import com.scrm.api.wx.cp.entity.BrJourneyStage;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;


@Data
@Accessors(chain = true)
@ApiModel(value = "旅程VO")
public class WxCustomerJourneyVO extends BrJourney {

    @ApiModelProperty(value = "旅程阶段")
    private List<BrJourneyStage> journeyStages;

}
