package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrFieldLog;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author ouyang
 * @since 2022-06-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "字段变化记录结果集")
public class BrFieldLogVO extends BrFieldLog{

    @ApiModelProperty(value = "操作人")
    private Staff operator;

}
