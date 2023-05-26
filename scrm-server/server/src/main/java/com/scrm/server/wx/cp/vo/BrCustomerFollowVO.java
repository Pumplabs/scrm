package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.server.wx.cp.entity.BrCustomerFollow;
import com.scrm.server.wx.cp.entity.BrOpportunity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author xxh
 * @since 2022-05-19
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户跟进结果集")
public class BrCustomerFollowVO extends BrCustomerFollow{

    private WxCustomer wxCustomer;

    private BrOpportunity brOpportunity;

    private Staff staff;

    private List<BrCustomerFollowReplyVO> replyList;

    private Integer replyNum;

    @ApiModelProperty("跟进任务集合")
    private List<BrFollowTaskVO> taskList;

    public Integer getReplyNum() {
        return Optional.ofNullable(replyList).orElse(new ArrayList<>()).size();
    }
}
