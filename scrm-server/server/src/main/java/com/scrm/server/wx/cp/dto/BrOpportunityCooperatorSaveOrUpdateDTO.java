package com.scrm.server.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @author ouyang
 * @since 2022-06-07
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "商机-协作人关联新增修改DTO")
public class BrOpportunityCooperatorSaveOrUpdateDTO {

    @ApiModelProperty(value = "主键")
    private String id;
    
    @ApiModelProperty(value = "协作人id")
    private String cooperatorId;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "是否可编辑 1->是，0->否")
    private Boolean canUpdate;

}
