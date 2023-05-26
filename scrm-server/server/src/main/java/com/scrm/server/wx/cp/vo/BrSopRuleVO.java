package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrSopRule;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "sop规则结果集")
public class BrSopRuleVO extends BrSopRule{


}
