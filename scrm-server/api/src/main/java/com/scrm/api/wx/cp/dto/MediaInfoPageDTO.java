package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;
import java.util.List;


@Data
@ApiModel(value = "素材管理分页请求参数")
@Accessors(chain = true)
public class MediaInfoPageDTO extends BasePageDTO {

    @ApiModelProperty("企业id")
    @NotNull(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("类型")
    private Integer type;

    @ApiModelProperty("类型集合")
    private List<Integer> typeList;

    @ApiModelProperty("标题")
    private String title;

    @ApiModelProperty("素材标签集合")
    private List<String> tagList;
}

