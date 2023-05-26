package com.scrm.api.wx.cp.dto;

import com.scrm.api.wx.cp.vo.AppInfoVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import java.util.List;


@Data
@Accessors(chain = true)
@ApiModel(value = "素材管理修改请求参数")
public class MediaInfoUpdateDTO {

    @NotBlank(message = "id不能为空")
    private String id;

    @ApiModelProperty("文件id")
    private String fileId;

    @ApiModelProperty(value = "标签，最长20")
    private String title;

    @ApiModelProperty(value = "描述，最长150")
    private String description;

    @ApiModelProperty(value = "文本内容，最长500")
    private String content;

    @ApiModelProperty(value = "概要，最长35")
    private String summary;

    @ApiModelProperty(value = "链接")
    private String link;

    @ApiModelProperty(value = "富文本文章内容")
    private List<Object> richText;

    @ApiModelProperty(value = "小程序的app的各种信息")
    private AppInfoVO appInfo;

    @ApiModelProperty(value = "素材标签集合")
    private List<String> mediaTagList;

    @ApiModelProperty(value = "微信标签集合")
    private List<String> wxTagList;

    @ApiModelProperty(value = "是否动态通知")
    private Boolean hasInform;


}
