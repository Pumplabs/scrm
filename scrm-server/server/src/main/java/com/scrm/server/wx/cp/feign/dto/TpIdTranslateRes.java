package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/10 14:25
 * @description：通讯录id转译结果
 **/
@Data
public class TpIdTranslateRes extends MpErrorCode{

    private String jobid;
}
