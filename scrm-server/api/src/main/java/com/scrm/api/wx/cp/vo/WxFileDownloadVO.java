package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/16 16:14
 * @description：微信文件下载VO
 **/
@Data
@ApiModel("微信文件下载VO")
public class WxFileDownloadVO {

    @ApiModelProperty("必填")
    @NotNull(message = "企业id必填")
    private String extCorpId;

    @ApiModelProperty("和mediaId二选一填")
    private List<String> ids;

    @ApiModelProperty("和id二选一填")
    private List<String> mediaIds;
}
