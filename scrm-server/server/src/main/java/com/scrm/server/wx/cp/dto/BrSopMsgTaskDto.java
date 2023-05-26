package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author ouyang
 * @description sop生成群发任务dto
 * @date 2022/4/19 14:26
 */
@Data
@Accessors(chain = true)
public class BrSopMsgTaskDto {

    private Map<String,List<String>> idMap;

    private BrSopRuleParamDto rule;

    private Date executeAt;

    //sop类型1：客户 2：群
    private Integer type;

    //sop名称
    private String sopName;

    //sop状态
    private Integer sopStatus;

    public static final Integer SOP_TYPE = 1;

    public static final Integer GROUP_SOP_TYPE = 2;

}
