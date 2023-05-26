package com.scrm.server.wx.cp.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;
import java.util.List;

/**
 * @author ouyang
 * @description
 * @date 2022/5/16 19:08
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "群sop规则执行详情")
public class BrGroupSopRuleExecuteVO {

    @ApiModelProperty(value = "实际发送时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date executeAt;

    @ApiModelProperty(value = "已完成数量")
    private Integer doneNum;

    @ApiModelProperty(value = "未完成数量")
    private Integer notDoneNum;

    @ApiModelProperty(value = "具体执行信息")
    private List<BrGroupSopExecuteDetailVO> executeDetailList;

    @ApiModelProperty(value = "群聊数量")
    private Integer chatNum;
}
