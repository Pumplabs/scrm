package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxTag;
import com.scrm.api.wx.cp.entity.WxFissionStage;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author xxh
 * @since 2022-03-21
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企微应用宝-阶梯任务信息表结果集")
public class WxFissionStageVO extends WxFissionStage{

    @ApiModelProperty("选中的标签信息")
    private List<WxTag> tagList;

    @ApiModelProperty("领奖客服信息")
    private List<Staff> staffVOList;
}
