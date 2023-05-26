package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/24 16:57
 * @description：企微应用宝统计VO
 **/
@Data
@ApiModel("企微应用宝统计VO")
@Accessors(chain = true)
public class WxFissionTaskCountVO {

    @ApiModelProperty("参与客户数")
    private Integer customerNum;

    @ApiModelProperty("裂变客户数（邀请好友总数）")
    private Integer addCustomerNum;

    @ApiModelProperty("流失客户数")
    private Integer loseCustomerNum;

    @ApiModelProperty("今日新增客户数")
    private Integer todayAddCustomerNum;

    @ApiModelProperty("助力成功数")
    private Integer successNum;
}
