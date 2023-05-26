package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/7 15:35
 * @description：渠道活码统计结果VO
 **/
@Data
@ApiModel("渠道活码统计结果VO")
@Accessors(chain = true)
public class ContactWayCountResVO {

    @ApiModelProperty("总客户数")
    private Integer totalNum = 0;

    @ApiModelProperty("流失数")
    private Integer loseNum = 0;

    @ApiModelProperty("净客户数")
    private Integer actualNum = 0;

    @ApiModelProperty("员工信息")
    private Staff staff;

    @ApiModelProperty("日期的字符串形式")
    private String dateStr;

    /**
     * 渠道码的统计罗偶极
     * @param wxCustomerStaff
     */
    public void count(WxCustomerStaff wxCustomerStaff){
        totalNum++;
        if ((wxCustomerStaff.getIsDeletedStaff() == null || !wxCustomerStaff.getIsDeletedStaff()) &&
                (wxCustomerStaff.getHasDelete() != null)) {
            actualNum ++;
        }else{
            loseNum++;
        }
    }
}
