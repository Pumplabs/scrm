package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.WxFissionStage;
import com.scrm.api.wx.cp.entity.WxFissionTaskCustomerDetail;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/30 16:56
 * @description：
 **/
@Data
@Accessors(chain = true)
@ApiModel("企微应用宝-客户完成详情VO-H5")
public class WxFissionTaskCustomerDetailH5VO extends WxFissionTaskCustomerDetail {

    @ApiModelProperty("阶梯信息，里面有阶段名和目标人数")
    private WxFissionStage fissionStage;

    @ApiModelProperty("是否解锁")
    private Boolean isOpen = false;

    @ApiModelProperty("成功人数")
    private Integer successNum;

    @ApiModelProperty("还需要邀请人数")
    private Integer needNum;
}
