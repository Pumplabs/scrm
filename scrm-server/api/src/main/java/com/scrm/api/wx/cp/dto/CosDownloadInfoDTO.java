package com.scrm.api.wx.cp.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.HashMap;
import java.util.Map;


@Data
@Accessors(chain = true)
public class CosDownloadInfoDTO extends CosFileTempSecretDTO{

    @ApiModelProperty("文件id和cos路径的map")
    private Map<String, String> idKeyMap = new HashMap<>();

    @ApiModelProperty("文件的mediaId和cos路径的map")
    private Map<String, String> mediaIdKeyMap = new HashMap<>();
}
