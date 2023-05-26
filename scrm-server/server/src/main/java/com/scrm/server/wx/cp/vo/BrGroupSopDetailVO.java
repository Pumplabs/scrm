package com.scrm.server.wx.cp.vo;

import com.scrm.server.wx.cp.entity.BrGroupSopDetail;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author ouyang
 * @since 2022-04-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群sop-规则执行详情表结果集")
public class BrGroupSopDetailVO extends BrGroupSopDetail{


}
