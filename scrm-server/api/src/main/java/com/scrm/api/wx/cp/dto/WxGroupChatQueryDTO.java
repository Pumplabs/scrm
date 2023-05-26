package com.scrm.api.wx.cp.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;

/**
 * @author xxh
 * @since 2022-01-19
 */
@Data
@ApiModel(value = "客户群条件查询请求参数")
@Accessors(chain = true)
public class WxGroupChatQueryDTO {

    @ApiModelProperty(value = "外部企业ID",required = true)
    private String extCorpId;

    @ApiModelProperty(value = "是否全部群聊：1->是，0->不是")
    private Boolean hasAllGroup;

    @ApiModelProperty(value = "选择群聊id集合")
    private List<String> groupIds;

    @ApiModelProperty(value = "群聊创建开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date startTime;

    @ApiModelProperty(value = "群聊创建结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dds")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date endTime;

    @ApiModelProperty(value = "群名关键字")
    private String groupName;

    @ApiModelProperty(value = "群标签")
    private List<String> groupTags;

    @ApiModelProperty(value = "选群主,部门id集合(extId)")
    private List<Long> departmentIds;

    @ApiModelProperty(value = "选群主,群主id集合(extId)")
    private List<String> leaderIds;

}
