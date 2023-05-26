package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;


@Data
@ApiModel(value = "渠道活码分页请求参数")
@Accessors(chain = true)
public class ContactWayPageDTO extends BasePageDTO {

    @ApiModelProperty("企业id")
    @NotNull(message = "请输入企业信息")
    private String extCorpId;

    @ApiModelProperty("分组id")
    private String groupId;

    @ApiModelProperty("员工id集合")
    private List<String> staffIds;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("创建时间开始")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtStart;

    @ApiModelProperty("创建时间结束")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAtEnd;

}

