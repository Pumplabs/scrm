package com.scrm.api.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;


@Data
@Accessors(chain = true)
public class CosFileTempSecretDTO {

    private String bucket;

    private String region;

    private String tmpSecretId;

    private String tmpSecretKey;

    private String sessionToken;

    private Long startTime;

    private Long expiredTime;
    
}
