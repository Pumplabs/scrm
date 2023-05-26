package com.scrm.server.wx.cp.dto;

import com.scrm.api.wx.cp.entity.MediaInfo;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxDynamicMedia;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/7/18 20:21
 * @description：查询素材客户浏览记录结果
 **/
@Data
@ApiModel("查询素材客户浏览记录结果")
public class WxDynamicMediaVO extends WxDynamicMedia {
    
    @ApiModelProperty("客户信息")
    private WxCustomer wxCustomer;
    
    @ApiModelProperty("员工信息")
    private Staff staff;
    
    @ApiModelProperty("轨迹素材信息")
    private MediaInfo mediaInfo;
}
