package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.SysSwitch;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-26
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "系统按钮结果集")
public class SysSwitchVO extends SysSwitch{


}
