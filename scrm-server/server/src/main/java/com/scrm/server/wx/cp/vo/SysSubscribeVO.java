package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.entity.SysSubscribe;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import java.util.List;

/**
 * 企业订阅管理
 * @author ouyang
 * @since 2022-05-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业订阅结果集")
public class SysSubscribeVO extends SysSubscribe {

    @ApiModelProperty(value = "版本名称")
    private String versionName;

    @ApiModelProperty(value = "员工席位集合")
    private List<Staff> staffList;

}
