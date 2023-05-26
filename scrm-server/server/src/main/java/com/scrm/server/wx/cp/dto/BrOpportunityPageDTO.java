package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@ApiModel(value = "商机分页请求参数")
@Accessors(chain = true)
public class BrOpportunityPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "优先级 1->高，2->中 3->低")
    private Integer priority;

    @ApiModelProperty("创建时间开始")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtStart;

    @ApiModelProperty("创建时间结束")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtEnd;

    @ApiModelProperty(value = "阶段id")
    private String stageId;

    @ApiModelProperty(value = "负责人")
    private String owner;

    @ApiModelProperty(value = "所属分组id")
    private String groupId;

    @ApiModelProperty("商机状态 0:跟进中 1:已关闭")
    @NotNull(message = "商机状态不能为空")
    private Integer status;

    @ApiModelProperty(value = "名称")
    private String name;

    private String currentUserId;

    private String currentExtUserId;

    private List<String> stageIdList;

    private List<String> notStageIdList;

    //商机状态：跟进中
    public static final Integer DOING_STATUS = 0;

    //商机状态：已关闭
    public static final Integer CLOSE_STATUS= 1;

}

