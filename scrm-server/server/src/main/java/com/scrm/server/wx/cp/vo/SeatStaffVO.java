package com.scrm.server.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Collection;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/6/22 15:39
 * @description：席位的员工id
 **/
@Data
@Accessors(chain = true)
@ApiModel("席位的员工id")
public class SeatStaffVO {
    
    @ApiModelProperty("企业id")
    private String extCorpId;
    
    @ApiModelProperty("员工id集合")
    private Collection<String> extStaffIds;
}
