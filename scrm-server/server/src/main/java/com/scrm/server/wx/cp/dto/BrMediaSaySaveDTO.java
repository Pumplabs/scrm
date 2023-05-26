package com.scrm.server.wx.cp.dto;

import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author xxh
 * @since 2022-05-10
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "（素材库）企业话术新增DTO")
public class BrMediaSaySaveDTO {

    @NotBlank(message = "企业id不能为空")
    private String extCorpId;

    @ApiModelProperty(value = "分组id")
    @NotBlank(message = "分组id不能为空")
    private String groupId;

    @ApiModelProperty(value = "话术内容")
    @NotNull(message = "话术内容不能为空")
    private WxMsgDTO msg;

    @ApiModelProperty("标签id集合")
    private List<String> tagIdList;

    @ApiModelProperty("话术名")
    @NotBlank(message = "话术名不能为空")
    private String name;
}
