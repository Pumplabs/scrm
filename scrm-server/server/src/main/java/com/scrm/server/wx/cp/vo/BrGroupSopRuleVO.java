package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrGroupSopRule;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群sop规则结果集")
public class BrGroupSopRuleVO extends BrGroupSopRule{


}
