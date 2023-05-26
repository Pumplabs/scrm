package com.scrm.server.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author xxh
 * @since 2022-05-10
 */
@Data
@ApiModel(value = "（素材库）企业话术分页请求参数")
@Accessors(chain = true)
public class BrMediaSayPageDTO extends BasePageDTO{

    @ApiModelProperty("企业id")
    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty("分组id")
    @NotBlank(message = "请选择分组")
    private String groupId;

    @ApiModelProperty("模糊查询关键字")
    private String code;

    @ApiModelProperty("标签Id集合")
    private List<String> tagList;
}

