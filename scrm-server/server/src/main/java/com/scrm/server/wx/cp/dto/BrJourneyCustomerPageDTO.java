package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;

/**
 * @author xuxh
 * @date 2022/4/8 16:54
 */
@Data
@ApiModel(value = "旅程阶段客户分页请求参数")
@Accessors(chain = true)
public class BrJourneyCustomerPageDTO extends BasePageDTO {

    @ApiModelProperty(value = "企业id", required = true)
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "所属旅程id", required = true)
    @NotBlank(message = "所属旅程不能为空")
    private String journeyId;

    @ApiModelProperty(value = "客户名称")
    private String name;

    @ApiModelProperty(value = "添加开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtBegin;

    @ApiModelProperty(value = "添加结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtEnd;

    @ApiModelProperty(value = "标签列表")
    private List<String> extTagIds;
}
