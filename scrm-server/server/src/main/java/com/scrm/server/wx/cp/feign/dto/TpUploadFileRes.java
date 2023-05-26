package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/10 11:55
 * @description：企微第三方上传临时文件结果
 **/
@Data
public class TpUploadFileRes extends MpErrorCode{

    private String type;

    private String media_id;

    private String created_at;
}
