package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author ouyang
 * @since 2022-06-16
 */
@Data
@ApiModel(value = "跟进任务条件查询请求参数")
@Accessors(chain = true)
public class BrFollowTaskQueryDTO {

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("跟进id集合")
    private List<String> followIds;
}
