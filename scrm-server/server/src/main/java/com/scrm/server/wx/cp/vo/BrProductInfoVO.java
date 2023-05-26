package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrProductInfo;
import com.scrm.server.wx.cp.entity.BrProductType;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-07-17
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "产品信息结果集")
public class BrProductInfoVO extends BrProductInfo{

    @ApiModelProperty(value = "产品分类")
    private BrProductType productType;

    @ApiModelProperty(value = "创建员工id")
    private Staff creatorStaff;


}
