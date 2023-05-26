package com.scrm.server.wx.cp.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.WxMsgAttachmentDTO;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.server.wx.cp.entity.BrCommonConf;
import com.scrm.server.wx.cp.entity.BrOpportunity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "商机结果集")
public class BrOpportunityVO extends BrOpportunity{

    @ApiModelProperty("创建人名字")
    private String creatorCN;

    @ApiModelProperty("更新人")
    private Staff editorStaff;

    @ApiModelProperty("负责人")
    private Staff ownerStaff;

    @ApiModelProperty("所属阶段")
    private BrCommonConf stage;

    @ApiModelProperty("协作人集合")
    private List<BrOpportunityCooperatorVO> cooperatorList;

    @ApiModelProperty("跟进集合")
    private List<BrCustomerFollowVO> followList;

    @ApiModelProperty("附件集合")
    private List<WxMsgAttachmentDTO> mediaList;

    @ApiModelProperty("任务集合")
    private List<BrFollowTaskVO> taskList;

    @ApiModelProperty(value = "选择的失败原因")
    private String failReasonCN;

    @ApiModelProperty(value = "上次跟进时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date lastFollowAt;

    @ApiModelProperty(value = "所属分组名称")
    private String groupName;

    @ApiModelProperty("关联客户")
    private WxCustomer customer;
}
